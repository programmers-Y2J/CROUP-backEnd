import express from 'express';
import {  createQuestion,  updateQuestion,  getQuestions,  getQuestionDetail, addComment,} from './qna-controller.js';
import authMiddleware from '../token/auth-middleware.js';
import { validateCreateQuestion, validateCreateComment  } from './qna-validator.js'

const qnaRouter = express.Router();

qnaRouter.post('/room/:roomId/question', authMiddleware, validateCreateQuestion, createQuestion);
qnaRouter.put('/room/:roomId/question/:questionId', authMiddleware, updateQuestion);
qnaRouter.get('/room/:roomId/questions', authMiddleware, getQuestions);
qnaRouter.get('/room/:roomId/question/:questionId', authMiddleware, getQuestionDetail);
qnaRouter.post('/room/:roomId/question/:questionId/comments', authMiddleware, validateCreateComment,addComment);

export default qnaRouter;