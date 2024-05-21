import express from 'express';
import { createRoom, getRooms, deleteRoom, joinRoom } from './room-controller.js';
import { validateCreateRoom, validateJoinRoom } from './room-validator.js';
import tokenManager from '../token/token-manager.js';

const roomRouter = express.Router();

roomRouter.get('', getRooms);

roomRouter.post('', (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const userId = tokenManager.verify(token!);
    req.user = { userId };
    next();
  }, validateCreateRoom, createRoom);

  roomRouter.delete('/:roomId', (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const userId = tokenManager.verify(token!);
    req.user = { userId };
    next();
  }, deleteRoom);

  roomRouter.post('/in/:roomId', (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const userId = tokenManager.verify(token!); 
    req.user = { userId }; 
    next();
  }, validateJoinRoom, joinRoom);

// roomRouter.post('', validateCreateRoom, createRoom);
// roomRouter.get('', getRooms);
// roomRouter.delete('/:roomId', deleteRoom);
// roomRouter.post('/in/:roomId', validateJoinRoom, joinRoom);

export default roomRouter;