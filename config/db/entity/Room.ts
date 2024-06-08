import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Room {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  managerId: string;

  @Column()
  roomTitle: string;

  @Column()
  roomDescription: string;

  @Column()
  roomThumbnail: string;

  @Column()
  playListUrl: string;

  @Column('array')
  playList: { musicTitle: string; musicThumbnail: string; musicChannelTitle: string; videoId: string }[];

  @Column('array')
  roomMember: { userId: ObjectId; nickName: string }[];

  @Column('array', { default: [] })
  chats: { userId: ObjectId; nickName: string; chat: string }[];
}