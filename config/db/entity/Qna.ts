import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Qna {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  roomId: string;

  @ObjectIdColumn()
  userId: ObjectId;

  @Column()
  userName: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('json')
  comments: { commentId: string; userId: ObjectId; userName: string; content: string }[];
}
