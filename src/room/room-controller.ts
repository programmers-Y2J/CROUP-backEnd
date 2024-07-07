import { Request, Response } from 'express';
import { createRoomService, getRoomsService, deleteRoomService, joinRoomService, getRoomService, searchRoomsService } from './room-service.js';

export const createRoom = async (req: Request, res: Response) => {
  const { roomTitle, roomDescription, playListUrl, playList, tags } = req.body;
  const { userId } = req.user!;

  const missingFields = [];
  if (!roomTitle) missingFields.push('title');
  if (!roomDescription) missingFields.push('description');
  if (!playListUrl) missingFields.push('playListUrl');
  if (!playList) missingFields.push('playList');
  if (!tags) missingFields.push('tags');

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `${missingFields.join(', ')}의 입력값이 없습니다`
    });
  }
  
  try {
    const result = await createRoomService(userId, roomTitle, roomDescription, playListUrl, playList, tags);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  const { currentPage = 1, limit = 10, sort = 'createdAt' } = req.query;
  try {
    const result = await getRoomsService(Number(currentPage), Number(limit), sort as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '잘못된 요청입니다.' });
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

export const searchRooms = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const sortBy = req.query.sort as string || 'createdAt';
  const currentPage = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;  

  if (!query) {
    return res.status(400).json({ success: false, message: '검색어를 입력해주세요.' });
  }

  try {
    const result = await searchRoomsService(query, currentPage, limit, sortBy);
    console.log(`Search result - Found ${result.total} rooms, Page ${result.currentPage} of ${result.totalPages}`);
    res.status(200).json({ 
      success: true, 
      rooms: result.roomList,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      total: result.total
    });
  } catch (error: any) {
    console.error('Search error:', error);
    if (error instanceof TypeError) {
      res.status(400).json({ success: false, message: '잘못된 데이터 형식입니다.' });
    } else if (error.name === 'MongoError') {
      res.status(500).json({ success: false, message: '데이터베이스 오류가 발생했습니다.' });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '검색 요청을 처리하는 중 오류가 발생했습니다.', 
        error: error.message 
      });
    }
  }
};