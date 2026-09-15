import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

interface JoinRoomPayload {
  roomId: string;
}

interface SignalPayload {
  to: string;
  data: unknown;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: JoinRoomPayload,
  ): void {
    const peerId = client.id;
    const peers = this.roomService.join(roomId, peerId);

    client.data.roomId = roomId;
    void client.join(roomId);

    client.emit('room-joined', { peerId, peers });
    client.to(roomId).emit('peer-joined', { peerId });
  }

  @SubscribeMessage('signal')
  handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() { to, data }: SignalPayload,
  ): void {
    this.server.to(to).emit('signal', { from: client.id, data });
  }

  handleDisconnect(client: Socket): void {
    const roomId = client.data.roomId as string | undefined;
    if (!roomId) return;

    this.roomService.leave(roomId, client.id);
    client.to(roomId).emit('peer-left', { peerId: client.id });
  }
}
