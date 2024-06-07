import { Request, Response } from 'express';
import { createQuestionService, updateQuestionService, getQuestionsService, getQuestionDetailService, addCommentService } from './qna-service.js';

export const createQuestion = async (req: Request, res: Response) => {
  const { roomId, title, content } = req.body;
  const { userId, nickName } = req.user!;

  if (!roomId || !title || !content) {
    return res.status(400).json({ success: false, message: '입력값이 없습니다.' });
  }
  
  try {
    const result = await createQuestionService(roomId, userId, nickName, title, content);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { questionId, title, content } = req.body;
  const { userId } = req.user!;

  if (!questionId || !title || !content) {
    return res.status(400).json({ success: false, message: '입력값이 없습니다.' });
  }
  
  try {
    const result = await updateQuestionService(questionId, userId, title, content);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const result = await getQuestionsService(roomId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getQuestionDetail = async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    const result = await getQuestionDetailService(questionId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { questionId, content } = req.body;
  const { userId, nickName } = req.user!;

  if (!questionId || !content) {
    return res.status(400).json({ success: false, message: '입력값이 없습니다.' });
  }
  
  try {
    const result = await addCommentService(questionId, userId, nickName, content);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};