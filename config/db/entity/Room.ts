import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Room {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  roomTitle: string;

  @Column()
  roomDescription: string;

  @Column()
  roomThumbnail: string;

  @Column()
  playListUrl: string;

  @Column('simple-array')
  roomMember: string[];

  @Column('text', { array: true, default: [] })
  chats: { nickName: string; chat: string }[];
}
