import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Room {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  managerId: string; //유저의 id값을 참조

  @Column()
  roomTitle: string;

  @Column()
  roomDescription: string;

  @Column()
  roomThumbnail: string;

  @Column()
  playListUrl: string;

  @Column('simple-array')
  roomMember: { userId: string; nickName: string }[];

  @Column('text', { array: true, default: [] })
  chats: { nickName: string; chat: string }[];
}
