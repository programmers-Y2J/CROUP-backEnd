import { FindOneOptions } from 'typeorm';
import { Room } from '../../config/db/entity/Room.js';
import { ObjectId } from 'mongodb';
import { getPlaylistThumbnail } from '../utils.js';
import { AppDataSource } from '../../config/db/data-source.js';

export const createRoomService = async (userId: string, roomTitle: string, roomDescription: string, playListUrl: string, playList: any[],tags: string) => {
  const roomRepository = AppDataSource.getRepository(Room);

  const roomThumbnail = playList.length > 0 ? playList[0].musicThumbnail : 'defaultThumbnailUrl';

  const newRoom = roomRepository.create({
    managerId: userId,
    roomTitle,
    roomDescription,
    playListUrl,
    roomThumbnail,
    playList,
    roomMember: [{ userId: new ObjectId(userId), nickName: '관리자' }],
    chats: [],
    createdAt: new Date(),
    memberCount: 1,
    tags
  });

  await roomRepository.save(newRoom);

  return { success: true, message: '방이 생성되었습니다.' };
};

export const getRoomsService = async (currentPage: number, limit: number, sortBy: string) => {
  const roomRepository = AppDataSource.getRepository(Room);

  const order: { [key: string]: 'ASC' | 'DESC' } = {};
  if (sortBy === 'popularity') {
    order.memberCount = 'DESC';
  } else {
    order.createdAt = 'DESC';  
  }

  try {
    const [rooms, total] = await roomRepository.findAndCount({
      select: ['roomTitle', '_id', 'managerId', 'roomDescription', 'roomThumbnail', 'createdAt', 'memberCount', 'tags'],
      order,
      skip: (currentPage - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    const roomList = rooms.map((room) => ({
      roomTitle: room.roomTitle,
      roomId: room._id.toString(),
      managerId: room.managerId,
      roomDescription: room.roomDescription,
      roomThumbnail: room.roomThumbnail,
      createdAt: room.createdAt,
      memberCount: room.memberCount,
      tags: room.tags,
    }));

    return { 
      roomList, 
      currentPage, 
      totalPages, 
      total 
    };
  } catch (error) {
    console.error('Error in getRoomsService:', error);
    throw new Error('방 목록을 가져오는 중 오류가 발생했습니다.');
  }
};


export const getRoomService = async (roomId: string, userId: string) => {
  const roomRepository = AppDataSource.getRepository(Room);
  const objectId = new ObjectId(roomId);
  const room = await roomRepository.findOne({ where: { _id: objectId } });
  
  if (!room) {
    return { success: false, message: '방을 찾을 수 없습니다.' };
  }

  const isMember = room.roomMember.some(member => member.userId.equals(new ObjectId(userId))); 

  if (!isMember) {
    return { success: false, message: '방에 참여하지 않은 사용자입니다.' };
  }

  const { playList, roomMember, chats, createdAt, tags } = room;

  return {
    success: true,
    playList,
    roomMember,
    chats,
    createdAt,
    tags
  };
};

export const deleteRoomService = async (roomId: string, userId: string) => {
  const roomRepository = AppDataSource.getRepository(Room);
  const objectId = new ObjectId(roomId);
  const room = await roomRepository.findOne({ where: { _id: objectId } });

  if (!room) {
    return { success: false, message: '방을 찾을 수 없습니다' };
  }

  if (room.managerId !== userId) {
    return { success: false, message: '권한이 없습니다' };
  }

  await roomRepository.remove(room);
  return { success: true, message: '방이 삭제되었습니다' };
};

export const joinRoomService = async (roomId: string, userId: string, nickName: string) => {
  const roomRepository = AppDataSource.getRepository(Room);
  const objectId = new ObjectId(roomId);
  const room = await roomRepository.findOne({ where: { _id: objectId } });

  if (!room) {
    return { success: false, message: '방을 찾을 수 없습니다.' };
  }

  const isAlreadyMember = room.roomMember.some(member => member.userId.equals(new ObjectId(userId)));

  if (!isAlreadyMember) {
    room.roomMember.push({ userId: new ObjectId(userId), nickName });
    room.memberCount += 1; 
    await roomRepository.save(room);
  }

  return { success: true, message: '성공적으로 방에 가입했습니다.' };
};

export const searchRoomsService = async (query: string, currentPage: number, limit: number, sortBy: string) => {
  const roomRepository = AppDataSource.getRepository(Room);
  const searchRegex = new RegExp(query, 'i');

  const findOptions: any = {
    where: {
      $or: [
        { roomTitle: { $regex: searchRegex } },
        { roomDescription: { $regex: searchRegex } },
        { tags: { $regex: searchRegex } }
      ]
    },
    skip: (currentPage - 1) * limit,
    take: limit
  };

  if (sortBy === 'popularity') {
    findOptions.order = { memberCount: 'DESC' };
  } else {
    findOptions.order = { createdAt: 'DESC' };
  }

  const [rooms, total] = await roomRepository.findAndCount(findOptions);

  const roomList = rooms.map((room) => ({
    roomTitle: room.roomTitle,
    roomId: room._id.toString(),
    managerId: room.managerId,
    roomDescription: room.roomDescription,
    roomThumbnail: room.roomThumbnail,
    createdAt: room.createdAt,
    memberCount: room.memberCount,
    tags: room.tags,
  }));

  const totalPages = Math.ceil(total / limit);

  return { roomList, currentPage, totalPages, total };
};