import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

const dateTransformer = {
  from: (date: Date | null): string | null => {
    if (!date) return null;
    const koreanTime = date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
    const [datePart, timePart] = koreanTime.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:${seconds}`;
    return formattedDate;
  },
  to: (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const koreanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    return koreanDate;
  }
};

@Entity()
export class Qna {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  nickName: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'datetime', transformer: dateTransformer })
  createdAt: Date;

  @Column('array')
  comments: { commentId: string; userId: string; nickName: string; content: string }[];
}