import express from 'express';
import { createRoom, getAllRooms, deleteRoom, joinRoom, getRoom, searchRooms, favoriteRoom } from './room-controller.js';
import { validateCreateRoom } from './room-validator.js';
import authMiddleware from '../token/auth-middleware.js';

const roomRouter = express.Router();

roomRouter.post('', authMiddleware, validateCreateRoom, createRoom);
roomRouter.get('', authMiddleware, getAllRooms);
roomRouter.get('/search', authMiddleware, searchRooms);
roomRouter.post('/:roomId/favorite', authMiddleware, favoriteRoom);
roomRouter.get('/:roomId', authMiddleware, getRoom);
roomRouter.delete('/:roomId', authMiddleware, deleteRoom);
roomRouter.post('/:roomId', authMiddleware, joinRoom);

export default roomRouter;