import express from 'express';
import {  createQuestion,  updateQuestion,  getQuestions,  getQuestionDetail, addComment,} from './qna-controller.js';
import authMiddleware from '../token/auth-middleware.js';
import { validateCreateQuestion, validateCreateComment  } from './qna-validator.js'

const qnaRouter = express.Router();

qnaRouter.post('', authMiddleware, validateCreateQuestion, createQuestion);
qnaRouter.put('/:questionId', authMiddleware, updateQuestion);
qnaRouter.get('', authMiddleware, getQuestions);
qnaRouter.get('/:questionId', authMiddleware, getQuestionDetail);
qnaRouter.post('/:questionId/comments', authMiddleware, validateCreateComment,addComment);

export default qnaRouter;