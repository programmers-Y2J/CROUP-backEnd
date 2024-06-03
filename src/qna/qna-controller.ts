import { Request, Response } from 'express';
import {  createQuestionService,  updateQuestionService,  getQuestionsService,  getQuestionDetailService,  createCommentService,} from './qna-service.js';

export const createQuestion = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user!;
  const { title, content } = req.body;

  try {
    const result = await createQuestionService(roomId, userId, title, content);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { roomId, questionId } = req.params;
  const { userId } = req.user!;
  const { title, content } = req.body;

  try {
    const result = await updateQuestionService(roomId, questionId, userId, title, content);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const result = await getQuestionsService(roomId, req.user!.userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getQuestionDetail = async (req: Request, res: Response) => {
  const { roomId, questionId } = req.params;

  try {
    const result = await getQuestionDetailService(roomId, questionId, req.user!.userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { roomId, questionId } = req.params;
  const { userId } = req.user!;
  const { content } = req.body;

  try {
    const result = await createCommentService(roomId, questionId, userId, content);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};