import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: `mongodb+srv://croup:${process.env.DB_PASSWORD}@mycluster0.njajzcm.mongodb.net/?retryWrites=true&w=majority&appName=myCluster0`,
  database: 'croup',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
