import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { RoomDocument, Room } from '../../documents/room.schema';
import { UserDocument, User } from '../../documents/user.schema';

@Injectable()
export class RoomService {
  // живой список подключённых по сокету пиров - для WebRTC-сигналинга,
  // это не персистентные данные и в базу не пишется
  private readonly livePeers = new Map<string, Set<string>>();

  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(roomId: string, name?: string) {
    const creatorToken = randomBytes(24).toString('hex');
    await this.roomModel.create({ roomId, name, creatorToken });
    return { roomId, creatorToken };
  }

  async findAll() {
    const rooms = await this.roomModel
      .find()
      .select('roomId name createdAt users')
      .lean<(Room & { createdAt: Date })[]>();

    return rooms.map((room) => ({
      roomId: room.roomId,
      name: room.name,
      createdAt: room.createdAt,
      totalParticipants: room.users.length,
      online: this.livePeers.get(room.roomId)?.size ?? 0,
    }));
  }

  async exists(roomId: string): Promise<boolean> {
    return Boolean(await this.roomModel.exists({ roomId }));
  }

  async remove(roomId: string, creatorToken: string): Promise<void> {
    const room = await this.roomModel.findOne({ roomId });
    if (!room) throw new NotFoundException('Room not found');
    if (room.creatorToken !== creatorToken) {
      throw new ForbiddenException('Only the creator can delete this room');
    }

    await room.deleteOne();
  }

  // регистрирует юзера как когда-либо заходившего в комнату (для истории/счётчика)
  async addParticipant(roomId: string, name: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, returnDocument: 'after' },
    );

    await this.roomModel.updateOne(
      { roomId },
      { $addToSet: { users: user._id } },
    );

    return user;
  }

  join(roomId: string, peerId: string): string[] {
    const room = this.livePeers.get(roomId) ?? new Set<string>();
    const existingPeers = Array.from(room);

    room.add(peerId);
    this.livePeers.set(roomId, room);

    return existingPeers;
  }

  leave(roomId: string, peerId: string): void {
    const room = this.livePeers.get(roomId);
    if (!room) return;

    room.delete(peerId);
    if (room.size === 0) {
      this.livePeers.delete(roomId);
    }
  }
}
