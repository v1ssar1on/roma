import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { RoomService } from './room.service';

interface CreateRoomBody {
  roomId: string;
  name?: string;
}

interface DeleteRoomBody {
  creatorToken: string;
}

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() body: CreateRoomBody) {
    return this.roomService.create(body.roomId, body.name);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Delete(':roomId')
  @HttpCode(204)
  remove(
    @Param('roomId') roomId: string,
    @Body() body: DeleteRoomBody,
  ): Promise<void> {
    return this.roomService.remove(roomId, body.creatorToken);
  }
}
