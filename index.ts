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

const io = new Server(server, { path: '/rooms', cors: { origin: 'http://localhost:3000' } });

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
