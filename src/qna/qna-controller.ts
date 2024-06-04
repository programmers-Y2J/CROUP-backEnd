import { Request, Response } from 'express';
import { createQuestionService, updateQuestionService, getQuestionsService, getQuestionDetailService, addCommentService } from './qna-service.js';

export const createQuestion = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId, nickName } = req.user!;
  const { title, content } = req.body;
  
  try {
    const result = await createQuestionService(roomId, userId, nickName, title, content);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { questionId } = req.params;
  const { userId } = req.user!;
  const { title, content } = req.body;
  
  try {
    const result = await updateQuestionService(questionId, userId, title, content);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const result = await getQuestionsService(roomId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const getQuestionDetail = async (req: Request, res: Response) => {
  const { questionId } = req.params;
  
  try {
    const result = await getQuestionDetailService(questionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { questionId } = req.params;
  const { userId, nickName } = req.user!;
  const { content } = req.body;
  
  try {
    const result = await addCommentService(questionId, userId, nickName, content);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};