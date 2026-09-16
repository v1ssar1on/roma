import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { RoomService } from './room.service';
import { MessageService } from './message.service';

interface JoinRoomPayload {
  roomId: string;
  name: string;
}

interface SignalPayload {
  to: string;
  data: unknown;
}

interface SendMessagePayload {
  text: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId, name }: JoinRoomPayload,
  ): Promise<void> {
    const roomExists = await this.roomService.exists(roomId);
    if (!roomExists) {
      client.emit('room-not-found');
      return;
    }

    const peerId = client.id;
    const peers = this.roomService.join(roomId, peerId);
    const user = await this.roomService.addParticipant(roomId, name);

    client.data.roomId = roomId;
    client.data.name = name;
    client.data.userId = user._id as Types.ObjectId;
    void client.join(roomId);

    client.emit('room-joined', { peerId, peers });
    client.emit(
      'message-history',
      await this.messageService.findByRoom(roomId),
    );
    client.to(roomId).emit('peer-joined', { peerId });
  }

  @SubscribeMessage('signal')
  handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() { to, data }: SignalPayload,
  ): void {
    this.server.to(to).emit('signal', { from: client.id, data });
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { text }: SendMessagePayload,
  ): Promise<void> {
    const roomId = client.data.roomId as string | undefined;
    const name = client.data.name as string | undefined;
    const userId = client.data.userId as Types.ObjectId | undefined;
    if (!roomId || !name || !userId || !text.trim()) return;

    const message = await this.messageService.create(
      roomId,
      userId,
      name,
      text.trim(),
    );

    this.server.to(roomId).emit('new-message', message);
  }

  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId as string | undefined;
    if (!roomId) return;

    this.roomService.leave(roomId, client.id);
    client.to(roomId).emit('peer-left', { peerId: client.id });
  }
}
