import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MessageService } from './message.service';
import { Room, RoomSchema } from '../../documents/room.schema';
import { User, UserSchema } from '../../documents/user.schema';
import { Message, MessageSchema } from '../../documents/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomGateway, RoomService, MessageService],
})
export class RoomModule {}
