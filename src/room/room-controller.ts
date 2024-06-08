import { Request, Response } from 'express';
import { createRoomService, getRoomsService, deleteRoomService, joinRoomService, getRoomService } from './room-service.js';

export const createRoom = async (req: Request, res: Response) => {
  const { roomTitle, roomDescription, playListUrl, playList } = req.body;
  const { userId } = req.user!;

  const missingFields = [];
  if (!roomTitle) missingFields.push('title');
  if (!roomDescription) missingFields.push('description');
  if (!playListUrl) missingFields.push('playListUrl');
  if (!playList) missingFields.push('playList');

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `${missingFields.join(', ')}의 입력값이 없습니다`
    });
  }
  
  try {
    const result = await createRoomService(userId, roomTitle, roomDescription, playListUrl, playList);
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