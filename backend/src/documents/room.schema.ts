import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Room {
  // id, который генерирует и присылает фронт (nanoid), не путать с _id
  @Prop({ required: true, unique: true, index: true })
  roomId: string;

  @Prop()
  name: string;

  // секрет, который знает только создатель комнаты - им подтверждается удаление
  @Prop({ required: true })
  creatorToken: string;

  // все, кто когда-либо заходил в комнату (для счётчика "сколько всего было")
  // ref строкой, а не User.name - иначе цикл room.schema <-> user.schema
  // ломается при загрузке модулей (Room/User ссылаются друг на друга)
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  users: Types.ObjectId[];
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
