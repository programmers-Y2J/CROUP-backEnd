import { ObjectId } from 'mongodb';
import { Qna } from '../../config/db/entity/Qna.js';
import { AppDataSource } from '../../config/db/data-source.js';

export const createQuestionService = async (roomId: string, userId: string, userName: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  
  const newQuestion = qnaRepository.create({
    roomId,
    userId: new ObjectId(userId),
    userName,
    title,
    content,
    comments: [],
  });
  
  await qnaRepository.save(newQuestion);
  
  return { success: true, message: '글이 성공적으로 업로드되었습니다.' };
};

export const updateQuestionService = async (questionId: string, userId: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  
  const question = await qnaRepository.findOneBy({ _id: objectId });
  
  if (!question || question.userId.toString() !== userId) {
    throw new Error('권한이 없습니다.');
  }
  
  question.title = title;
  question.content = content;
  
  await qnaRepository.save(question);
  
  return { success: true, message: '글이 수정되었습니다.' };
};

export const getQuestionsService = async (roomId: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  
  const questions = await qnaRepository.findBy({ roomId });
  
  return { qnaList: questions };
};

export const getQuestionDetailService = async (questionId: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  
  const question = await qnaRepository.findOneBy({ _id: objectId });
  
  if (!question) {
    throw new Error('글을 찾을 수 없습니다.');
  }
  
 return question;
};

export const addCommentService = async (questionId: string, userId: string, userName: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);

  const question = await qnaRepository.findOneBy({ _id: objectId });

  if (!question) {
    throw new Error('글을 찾을 수 없습니다.');
  }

  const newComment = {
    commentId: new ObjectId().toString(),
    userId: new ObjectId(userId),
    userName,
    content,
    };

  question.comments.push(newComment);

  await qnaRepository.save(question);

  return { success: true, message: '댓글 생성 완료되었습니다.' };
};