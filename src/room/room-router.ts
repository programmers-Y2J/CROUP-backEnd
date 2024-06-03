import express from 'express';
import { createRoom, getRooms, deleteRoom, joinRoom, getRoom } from './room-controller.js';
import { validateCreateRoom } from './room-validator.js';
import authMiddleware from '../token/auth-middleware.js';

const roomRouter = express.Router();

roomRouter.post('', authMiddleware, validateCreateRoom, createRoom);
roomRouter.get('', authMiddleware, getRooms);
roomRouter.get('/:roomId', authMiddleware, getRoom);
roomRouter.delete('', authMiddleware, deleteRoom);
roomRouter.post('/:roomId', authMiddleware, joinRoom);

export default roomRouter;