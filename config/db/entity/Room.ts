import { Entity, Column, ObjectIdColumn, ObjectId, CreateDateColumn } from 'typeorm';

@Entity()
export class Room {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  memberCount: number;
}