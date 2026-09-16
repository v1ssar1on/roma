import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true })
  name: string;

  // обратная связь: во всех каких комнатах юзер когда-либо был
  // ref строкой (см. комментарий в room.schema.ts про цикл Room <-> User)
  @Prop({ type: [Types.ObjectId], ref: 'Room', default: [] })
  rooms: Types.ObjectId[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
