import express from 'express';
import { createRoom, getRooms, deleteRoom, joinRoom, getRoom } from './room-controller.js';
import { validateCreateRoom } from './room-validator.js';
import authMiddleware from '../token/auth-middleware.js';

const roomRouter = express.Router();

roomRouter.post('/rooms', authMiddleware, validateCreateRoom, createRoom);
roomRouter.get('/rooms', authMiddleware, getRooms);
roomRouter.get('/rooms/in/:roomId', authMiddleware, getRoom);
roomRouter.delete('/rooms', authMiddleware, deleteRoom);
roomRouter.post('/rooms/in/:roomId', authMiddleware, joinRoom);

export default roomRouter;