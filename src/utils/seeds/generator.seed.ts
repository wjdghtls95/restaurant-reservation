import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { generateCustomers } from './generate-customer.seed';
import { generateRestaurants } from './generate-restaurant.seed';
import { seedTypeOrmConfig } from './config/seed-typeorm-config';

const dataSource = new DataSource(seedTypeOrmConfig);

const runSeeds = async () => {
  console.log('Seed generate start');
  await dataSource.initialize();
  console.log('Data Source Initialized');

  console.log('Customer Seed generate start');
  await generateCustomers(dataSource);
  console.log('Customer Seed generate done');

  console.log('Restaurant Seed generate start');
  await generateRestaurants(dataSource);
  console.log('Restaurant Seed generate done');

  await dataSource.destroy();
  console.log('Seed completed and connection closed');
};

runSeeds().catch((e) => {
  console.error('❌ Seed failed', e);
  process.exit(1);
});
