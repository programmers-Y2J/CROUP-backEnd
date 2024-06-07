import { Request, Response } from 'express';
import { createRoomService, getRoomsService, deleteRoomService, joinRoomService, getRoomService } from './room-service.js';

export const createRoom = async (req: Request, res: Response) => {
  const { title, description, playListUrl, playList } = req.body;
  const { userId } = req.user!;

  if (!title || !description || !playListUrl || !playList) {
    return res.status(400).json({ success: false, message: '입력값이 없습니다.' });
  }
  
  try {
    const result = await createRoomService(userId, title, description, playListUrl, playList);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getRooms = async (_req: Request, res: Response) => {
  try {
    const result = await getRoomsService();
    res.status(200).json({ rooms: result.roomList });
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user!;

  try {
    const result = await getRoomService(roomId, userId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  const { userId } = req.user!;

  try {
    const result = await deleteRoomService(roomId, userId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId, nickName } = req.user!;

  try {
    const result = await joinRoomService(roomId, userId, nickName);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' });
  }
};