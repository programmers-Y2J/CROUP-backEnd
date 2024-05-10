import { Server, ServerOptions } from 'socket.io';
import { Server as httpServer } from 'http';

class SocketManager {
  private io;

  constructor(server: httpServer, option: Partial<ServerOptions>) {
    this.io = new Server(server, option);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', socket => {
      socket.on('chat', (chatData, roomId) => {
        this.io.to(roomId).emit('chat', '채팅 데이터'); //해당 방에 댓글 데이터 전송
      });

      socket.on('joinRoom', (roomId, user) => {
        socket.join(roomId); //방 입장
        this.io.to(roomId).emit('updateUser', '유저들 데이터'); //해당 방에 참여한 유저들 전송
      });

      socket.on('disconnect', () => {
        const userId = socket.handshake.query.userId;

        //이후 추가 로직...
      });
    });
  }
}

export default SocketManager;
