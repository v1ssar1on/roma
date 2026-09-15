import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private readonly rooms = new Map<string, Set<string>>();

  join(roomId: string, peerId: string): string[] {
    const room = this.rooms.get(roomId) ?? new Set<string>();
    const existingPeers = Array.from(room);

    room.add(peerId);
    this.rooms.set(roomId, room);

    return existingPeers;
  }

  leave(roomId: string, peerId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.delete(peerId);
    if (room.size === 0) {
      this.rooms.delete(roomId);
    }
  }
}
