import { FindOneOptions } from 'typeorm';
import { Room } from '../../config/db/entity/Room.js';
import { ObjectId } from 'mongodb';
import { getPlaylistThumbnail } from '../utils.js';
import { AppDataSource } from '../../config/db/data-source.js';

export const createRoomService = async (managerId: string, title: string, description: string, playListUrl: string, playList: any[]) => {
  const roomRepository = AppDataSource.getRepository(Room);
  let thumbnail;

  try {
    thumbnail = await getPlaylistThumbnail(playListUrl);
  } catch (error) {
    throw new Error('Invalid URL');
  }

  const newRoom = roomRepository.create({
    managerId,
    roomTitle: title,
    roomDescription: description,
    playListUrl,
    roomThumbnail: thumbnail,
    playList,
    roomMember: [{ userId: managerId, nickName: '관리자' }], 
    chats: [],
  });

  await roomRepository.save(newRoom);

  return { success: true, message: '방이 생성되었습니다.' };
};

export const getRoomsService = async () => {
  const roomRepository = AppDataSource.getRepository(Room);
  const rooms = await roomRepository.find({
    select: ['roomTitle', '_id', 'roomDescription', 'roomThumbnail']
  });

  const roomList = rooms.map((room) => ({
    roomTitle: room.roomTitle,
    roomId: room._id.toString(),
    roomDescription: room.roomDescription,
    roomThumbnail: room.roomThumbnail,
  }));

  return { roomList };
};

export const getRoomService = async (roomId: string, userId: string) => {
  const roomRepository = AppDataSource.getRepository(Room);
  const objectId = new ObjectId(roomId);
  const room = await roomRepository.findOne({ where: { _id: objectId } });
  
  if (!room) {
    return { success: false, message: '방을 찾을 수 없습니다.' };
  }

  const isMember = room.roomMember.some(member => member.userId === userId);

  if (!isMember) {
    return { success: false, message: '방에 참여하지 않은 사용자입니다.' };
  }

  const { roomTitle, roomDescription, roomThumbnail, playList, roomMember, chats } = room;

  return {
    roomTitle,
    roomId: objectId.toString(),
    roomDescription,
    roomThumbnail,
    playList,
    roomMember,
    chats,
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
    return {success: false,  message: '방을 찾을 수 없습니다.' };
  }

  const isAlreadyMember = room.roomMember.some(member => member.userId === userId);
  if (!isAlreadyMember) {
    room.roomMember.push({ userId, nickName });
    await roomRepository.save(room);
  }

  return { success: true, message: '성공적으로 방에 가입했습니다.' };
};