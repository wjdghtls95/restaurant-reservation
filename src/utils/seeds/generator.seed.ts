import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { generateCustomers } from './generate-customer.seed';
import { generateRestaurants } from './generate-restaurant.seed';
import { seedTypeOrmConfig } from './config/seed-typeorm-config';

const dataSource = new DataSource(seedTypeOrmConfig);

const runSeeds = async () => {
  await dataSource.initialize();
  console.log('Data Source Initialized');

  await generateCustomers(dataSource);
  await generateRestaurants(dataSource);

  await dataSource.destroy();
  console.log('Seed completed and connection closed');
};

runSeeds().catch((e) => {
  console.error('❌ Seed failed', e);
  process.exit(1);
});
