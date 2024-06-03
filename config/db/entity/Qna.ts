import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Qna {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('json', { default: [] })
  comments: { commentId: string; userId: string; userName: string; content: string }[];
}