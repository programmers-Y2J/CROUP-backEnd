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
      socket.on('chat', async (chatData: { nickName: string; chat: string }, roomId: string) => {
        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({ where: { _id: new ObjectId(roomId) } });
        if (room) {
          room.chats.push(chatData);
          await roomRepository.save(room);
          this.io.to(room._id.toString()).emit('chat', chatData); //해당 방에 댓글 데이터 전송
        }
      });

      socket.on('joinRoom', async (roomId: string, user: { nickName: string; userId: string }) => {
        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({ where: { _id: new ObjectId(roomId) } });

        if (room) {
          room.roomMember.push(user);
          await roomRepository.save(room);
          const stringRoomId = room._id.toString();
          socket.join(stringRoomId); //방 입장
          this.io.to(stringRoomId).emit('updateUser', room.roomMember); //해당 방에 참여한 유저들 전송
        }
      });

      socket.on('disconnect', async () => {
        const userId = socket.handshake.query.userId as string;
        const room = await AppDataSource.getMongoRepository(Room).findOne({
          where: { roomMember: { $eleMatch: { userId: userId } } },
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
          const refreshMember = room.roomMember.filter(member => member.userId !== userId);
          await AppDataSource.mongoManager.updateOne(Room, { _id: room._id }, { $set: { roomMember: refreshMember } });
          this.io.to(stringRoomId).emit('updateUser', refreshMember);
      }
      });
    });
  }
}

export default SocketManager;
