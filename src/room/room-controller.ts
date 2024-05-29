import { Request, Response } from 'express';
import { createRoomService, getRoomsService, deleteRoomService, joinRoomService, getRoomService } from './room-service.js';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createRoom = async (req: AuthRequest, res: Response) => {
  const { title, description, playListUrl, playList } = req.body;
  const { userId } = req.user!;

  try {
    const result = await createRoomService(userId, title, description, playListUrl, playList);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'An unknown error occurred'  });
  }
};

export const getRooms = async (_req: Request, res: Response) => {
  try {
    const result = await getRoomsService();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: 'An unknown error occurred'  });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const result = await getRoomService(roomId);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'An unknown error occurred'  });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  const { roomId } = req.body;
  try {
    const result = await deleteRoomService(roomId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: 'An unknown error occurred'  });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.user!;
  const nickName = '닉네임'; 

  try {
    const result = await joinRoomService(roomId, userId, nickName);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: 'An unknown error occurred'  });
  }
};