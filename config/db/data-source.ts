import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 5432, //포트 설정 해야함
  username: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
