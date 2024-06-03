import { ObjectId } from 'mongodb';
import { Qna } from '../../config/db/entity/Qna.js';
import { AppDataSource } from '../../config/db/data-source.js';

export const createQuestionService = async (roomId: string, userId: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);

  const newQuestion = qnaRepository.create({
    roomId,
    userId,
    title,
    content,
    comments: [],
  });

  await qnaRepository.save(newQuestion);

  return { success: true, message: '글이 성공적으로 업로드되었습니다.' };
};

export const updateQuestionService = async (roomId: string, questionId: string, userId: string, title: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  const question = await qnaRepository.findOne({ where: { _id: objectId, roomId } });

  if (!question || question.userId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  question.title = title;
  question.content = content;

  await qnaRepository.save(question);

  return { success: true, message: '글이 수정되었습니다.' };
};

export const getQuestionsService = async (roomId: string, userId: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const questions = await qnaRepository.find({ where: { roomId } });

  const qnaList = questions.map(question => ({
    questionId: question._id.toString(),
    userName: question.userId,
    title: question.title,
    content: question.content,
  }));

  return { qnaList };
};

export const getQuestionDetailService = async (roomId: string, questionId: string, userId: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  const question = await qnaRepository.findOne({ where: { _id: objectId, roomId } });

  if (!question) {
    throw new Error('질문을 찾을 수 없습니다.');
  }

  const { title, content, userId: questionUserId, comments } = question;

  return {
    title,
    content,
    userName: questionUserId,
    comments,
  };
};

export const createCommentService = async (roomId: string, questionId: string, userId: string, content: string) => {
  const qnaRepository = AppDataSource.getRepository(Qna);
  const objectId = new ObjectId(questionId);
  const question = await qnaRepository.findOne({ where: { _id: objectId, roomId } });

  if (!question) {
    throw new Error('질문을 찾을 수 없습니다.');
  }

  const newComment = {
    commentId: new ObjectId().toString(),
    userId,
    userName: userId, 
    content,
  };

  question.comments.push(newComment);

  await qnaRepository.save(question);

  return { success: true, message: '댓글 생성 완료되었습니다.' };
};