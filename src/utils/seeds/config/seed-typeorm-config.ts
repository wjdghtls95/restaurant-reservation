import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Customer } from '../../../entity/customer.entity';
import { Restaurant } from '../../../entity/restaurant.entity';
import { Reservation } from '../../../entity/reservation.entity';
import { Menu } from '../../../entity/menu.entity';

dotenv.config();

// for debugging
console.log('DB_HOST:', process.env.DB_HOST);

export const seedTypeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Customer, Restaurant, Reservation, Menu],
  synchronize: true,
  logging: false,
};
