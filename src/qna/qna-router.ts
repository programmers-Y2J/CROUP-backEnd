import express from 'express';
import {  createQuestion,  updateQuestion,  getQuestions,  getQuestionDetail, addComment,} from './qna-controller.js';
import authMiddleware from '../token/auth-middleware.js';
import { validateCreateQuestion, validateCreateComment  } from './qna-validator.js'

const qnaRouter = express.Router();

qnaRouter.post('/question', authMiddleware, validateCreateQuestion, createQuestion);
qnaRouter.put('/question/:questionId', authMiddleware, updateQuestion);
qnaRouter.get('/questions', authMiddleware, getQuestions);
qnaRouter.get('question/:questionId', authMiddleware, getQuestionDetail);
qnaRouter.post('/question/:questionId/comments', authMiddleware, validateCreateComment,addComment);

// qnaRouter.post('/question', validateCreateQuestion, createQuestion);
// qnaRouter.put('/question/:questionId', updateQuestion);
// qnaRouter.get('/questions', getQuestions);
// qnaRouter.get('question/:questionId', getQuestionDetail);
// qnaRouter.post('/question/:questionId/comments', validateCreateComment,addComment);

export default qnaRouter;