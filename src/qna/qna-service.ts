import { ObjectId } from 'mongodb';
import { Qna } from '../../config/db/entity/Qna.js';
import { AppDataSource } from '../../config/db/data-source.js';

export const createQuestionService = async (roomId: string, userId: string, nickName: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  
  const newQuestion = qnaRepository.create({
    roomId,
    userId,
    nickName,
    title,
    content,
    comments: [],
    createdAt: new Date(),
  });
  
  await qnaRepository.save(newQuestion);
  
  return { success: true, message: '글이 성공적으로 업로드되었습니다.' };
};

export const updateQuestionService = async (questionId: string, userId: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  
  const question = await qnaRepository.findOneBy({ id: objectId });
  
  if (!question || question.userId !== userId) {
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
  
  const qnaList = questions.map(question => ({
    questionId: question.id.toHexString(),
    nickName: question.nickName,
    title: question.title,
    content: question.content,
    createdAt: question.createdAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), 
  }));
  
  return { qnaList };
};

export const getQuestionDetailService = async (questionId: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  
  const question = await qnaRepository.findOneBy({ id: objectId });
  
  if (!question) {
    throw new Error('글을 찾을 수 없습니다.');
  }

  const questionDetail = {
    title: question.title,
    content: question.content,
    nickName: question.nickName,
    createdAt: question.createdAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    comments: question.comments.map(comment => ({
      commentId: comment.commentId,
      nickName: comment.nickName,
      content: comment.content,
    })),
  };
  
  return questionDetail;
};

export const addCommentService = async (questionId: string, userId: string, nickName: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);

  const question = await qnaRepository.findOneBy({ id: objectId });

  if (!question) {
    throw new Error('글을 찾을 수 없습니다.');
  }

  const newComment = {
    commentId: new ObjectId().toHexString(), 
    userId,
    nickName,
    content,
  };

  question.comments.push(newComment);

  await qnaRepository.save(question);

  return { success: true, message: '댓글 생성 완료되었습니다.' };
};