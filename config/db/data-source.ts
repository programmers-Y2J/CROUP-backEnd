import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: 5432, //설정 필요
  username: 'your_username', //설정 필요
  password: 'your_password', //설정 필요
  database: 'your_database_name',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
