import express from 'express';
import http from 'http';
import cors from 'cors';
import { AppDataSource } from './config/db/data-source.js';
import cookieParser from 'cookie-parser';
import SocketManager from './src/websocket/socket-manager .js';
import userRouter from './src/user/user-router.js';
import roomRouter from './src/room/room-router.js'
import qnaRouter from './src/qna/qna-router.js';

const app = express();
const server = http.createServer(app);
new SocketManager(server, { path: '/rooms', cors: { origin: '*' } });

app.use(express.json());

app.use(cors());
app.use(cookieParser());

app.use('/auth', userRouter);
app.use('/rooms', roomRouter);
app.use('/room/:roomId', qnaRouter)


const port = 5000;
server.listen(port, async () => {
  //서버 실행시 ORM  초기화
  await AppDataSource.initialize()
    .then(async () => {
      console.log('ORM DB연결 성공');
      console.log(`open Server port ${port}`);
    })
    .catch(error => console.log(error));
});