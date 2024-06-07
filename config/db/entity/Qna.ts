import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

const dateTransformer = {
  to: (value: Date) => value,
  from: (value: Date) => value.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
};

@Entity()
export class Qna {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  roomId: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  nickName: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'datetime', transformer: dateTransformer })
  createdAt: Date;

  @Column('array')
  comments: { commentId: ObjectId; userId: ObjectId; nickName: string; content: string }[];
}