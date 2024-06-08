import { ObjectId } from 'mongodb';
import { Server, ServerOptions } from 'socket.io';
import { Server as httpServer } from 'http';
import { AppDataSource } from '../../config/db/data-source.js';
import { Room } from '../../config/db/entity/Room.js';

class SocketManager {
  private io;

  constructor(server: httpServer, option: Partial<ServerOptions>) {
    this.io = new Server(server, option);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', socket => {
      socket.on('chat', async (chatData: { userId: string; nickName: string; chat: string }, roomId: string) => {
        try {
          const roomRepository = AppDataSource.getRepository(Room);
          const room = await roomRepository.findOne({ where: { _id: new ObjectId(roomId) } });

          if (room) {
            room.chats.push({
              userId: new ObjectId(chatData.userId),
              nickName: chatData.nickName,
              chat: chatData.chat,
            });
            await roomRepository.save(room);
            this.io.to(room._id.toString()).emit('chat', chatData); //해당 방에 댓글 데이터 전송
          }
        } catch (error) {
          //new ObjectId() 생성시 12바이트 문자열, 24자리 16진수 문자열 또는 정수가 아니면 에러 발생
          console.log('roomId :', roomId);
          console.error(error);
        }
      });

      socket.on('joinRoom', async (roomId: string) => {
        try {
          const roomRepository = AppDataSource.getRepository(Room);
          const room = await roomRepository.findOne({ where: { _id: new ObjectId(roomId) } });

          if (room) {
            const stringRoomId = room._id.toString();
            socket.join(stringRoomId); //방 입장
            this.io.to(stringRoomId).emit('updateUser', room.roomMember); //해당 방에 참여한 유저들 전송
          }
        } catch (error) {
          //new ObjectId() 생성시 12바이트 문자열, 24자리 16진수 문자열 또는 정수가 아니면 에러 발생
          console.log('roomId :', roomId);
          console.error(error);
        }
      });

      socket.on('disconnect', async () => {
        const userId = socket.handshake.query.userId as string;
        try {
          const room = await AppDataSource.mongoManager.findOne(Room, {
            where: { roomMember: { $elemMatch: { userId: new ObjectId(userId) } } },
          });

          if (room) {
            const stringRoomId = room._id.toString();
            //만약 연결 끊긴 유저가 방장이면
            if (room.managerId === userId) {
              const message = '방장의 연결이 끊겨 방을 해체합니다';
              this.io.to(stringRoomId).emit('boom', message);
              return AppDataSource.mongoManager.delete(Room, room._id);
            }

            //방장이 아니면 접속중인 맴버 목록에서 제거
            const refreshMember = room.roomMember.filter(member => !member.userId.equals(new ObjectId(userId)));
            await AppDataSource.mongoManager.updateOne(
              Room,
              { _id: room._id },
              { $set: { roomMember: refreshMember } }
            );
            this.io.to(stringRoomId).emit('updateUser', refreshMember);
          }
        } catch (error) {
          //new ObjectId() 생성시 12바이트 문자열, 24자리 16진수 문자열 또는 정수가 아니면 에러 발생
          console.log('userId : ', userId);
          console.error(error);
        }
      });
    });
  }
}

export default SocketManager;
