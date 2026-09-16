import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageDocument, Message } from '../../documents/message.schema';
import { RoomDocument, Room } from '../../documents/room.schema';

export interface MessagePayload {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async create(
    roomId: string,
    userId: Types.ObjectId,
    authorName: string,
    text: string,
  ): Promise<MessagePayload> {
    const room = await this.roomModel.findOne({ roomId }).select('_id');
    if (!room) throw new NotFoundException('Room not found');

    const message = await this.messageModel.create({
      room: room._id,
      user: userId,
      text,
    });

    return {
      id: message._id.toString(),
      text: message.text,
      authorName,
      createdAt: (message as unknown as { createdAt: Date }).createdAt,
    };
  }

  async findByRoom(roomId: string): Promise<MessagePayload[]> {
    const room = await this.roomModel.findOne({ roomId }).select('_id');
    if (!room) return [];

    type LeanMessage = Message & {
      _id: Types.ObjectId;
      user: { name: string };
      createdAt: Date;
    };

    const messages = await this.messageModel
      .find({ room: room._id })
      .populate<{ user: { name: string } }>('user', 'name')
      .sort({ createdAt: 1 })
      .lean<LeanMessage[]>();

    return messages.map((message) => ({
      id: message._id.toString(),
      text: message.text,
      authorName: message.user?.name ?? 'unknown',
      createdAt: message.createdAt,
    }));
  }
}
