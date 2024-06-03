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

  @Column('json')
  playList: { musicTitle: string; musicThumbnail: string; musicChannelTitle: string; videoId: string }[];

  @Column('json')
  roomMember: { userId: string; nickName: string }[];

  @Column('json', { default: [] })
  chats: { userId: string; nickName: string; chat: string }[];
}
