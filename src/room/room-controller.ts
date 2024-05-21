import { Request, Response } from 'express';
import { createRoomService, getRoomsService, deleteRoomService, joinRoomService } from './room-service.js';

export const createRoom = async (req: Request, res: Response) => {
  const { title, description, playListUrl } = req.body;
  const result = await createRoomService(title, description, playListUrl);
  res.status(201).json(result);
};

export const getRooms = async (req: Request, res: Response) => {
  const rooms = await getRoomsService();
  res.json(rooms);
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await deleteRoomService(roomId);
  res.json(result);
};

export const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await joinRoomService(roomId);
  res.json(result);
};