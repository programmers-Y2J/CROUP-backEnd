import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { AppDataSource } from './config/db/data-source.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const server = http.createServer(app);
//               /rooms 경로로 웹소켓 연결     소켓서버 cors 허용해야함
const io = new Server(server, { path: '/rooms', cors: { origin: 'http://localhost:3000' } });
/**
 * 또는
 * cors: {
 *       origin: '*', //모든 도메인 요청 허용
 *       methods: ['GET', 'POST'], //요청 가능한 메서드
 *       allowedHeaders: ['Content-Type', 'Authorization'], //요청 가능한 해더
 *   }
 */

// 클라이언트와 소켓IO 연결됬는지 안됬는지 이벤트 실행. (채팅방에 누가 입장하였습니다/퇴장하였습니다 )
io.on('connection/disconnection', socket => {});

//웹소켓 연결 이벤트 'connection'
io.on('connection', socket => {
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`연결됨 소켓 아이디 : ${socket.id} IP : ${ip}`);

  //클라이언트에서 보내주는 chat 이벤트 대기
  socket.on('chat', (data, roomId, done) => {});

  // 클라이언트가 연결 종료 시
  socket.on('disconnect', () => {
    console.log('클라이언트 접속 해제', ip, socket.id);
  });
});

app.post('/rooms', (req, res) => {
  //방 생성 db 작업
});

const port = 5000;
server.listen(port, async () => {
  //서버 실행시 ORM 초기화
  await AppDataSource.initialize()
    .then(async () => {
      console.log('ORM DB연결 성공');
      console.log(`open Server port ${port}`);
    })
    .catch(error => console.log(error));
});
