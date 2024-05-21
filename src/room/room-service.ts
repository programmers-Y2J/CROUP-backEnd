import { getRepository, FindOneOptions } from 'typeorm';
import { Room } from '../../config/db/entity/Room.js';
import { ObjectId } from 'mongodb';
import { getPlaylistThumbnail } from '../utils.js';

export const createRoomService = async (title: string, description: string, playListUrl: string) => {
    const roomRepository = getRepository(Room);
    const thumbnail = await getPlaylistThumbnail(playListUrl);
  
    const newRoom = roomRepository.create({
      roomTitle: title,
      roomDescription: description,
      playListUrl,
      roomThumbnail: thumbnail,
    });
  
    await roomRepository.save(newRoom);
  
    return { success: true, message: 'Created' };
  };
  
  export const getRoomsService = async () => {
    const roomRepository = getRepository(Room);
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
  
  export const deleteRoomService = async (roomId: string) => {
    const roomRepository = getRepository(Room);
    const objectId = new ObjectId(roomId);
    const room = await roomRepository.findOne(objectId as FindOneOptions<Room>);
  
    if (!room) {
      return { error: 'Room not found' };
    }
  
    await roomRepository.remove(room);
    return { success: true, message: 'Deleted' };
  };
  
  export const joinRoomService = async (roomId: string) => {
    const roomRepository = getRepository(Room);
    const objectId = new ObjectId(roomId);
    const room = await roomRepository.findOne(objectId as FindOneOptions<Room>);
  
    if (!room) {
      return { error: 'Room not found' };
    }
  
    const { roomTitle, roomDescription, playListUrl, roomThumbnail, roomMember, chats } = room;
    const playList: { musicTitle: string; musicThumbnail: string; musicChannelTitle: string }[] = [];
  
    return {
      rooms: {
        roomTitle,
        roomId: objectId,
        roomDescription,
        roomThumbnail,
      },
      playList,
      roomMember,
      chats,
    };
  };