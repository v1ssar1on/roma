import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from './room.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  text: string;

  // сообщение принадлежит одной комнате (не rooms — связь один-к-одному в эту сторону)
  @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
  room: Types.ObjectId;

  // и написано одним юзером
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
