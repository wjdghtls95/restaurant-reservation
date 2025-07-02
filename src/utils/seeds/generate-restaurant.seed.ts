// src/seeds/restaurant.seed.ts
import { DataSource } from 'typeorm';
import { Restaurant } from '../../entity/restaurant.entity';
import { hash } from 'bcrypt';

export const generateRestaurants = async (dataSource: DataSource) => {
  const restaurantRepository = dataSource.getRepository(Restaurant);

  const hashesPassword = await hash('1234', 10);

  const dummyRestaurants = [
    { email: 'restaurant1', name: '엉터리생고기', password: hashesPassword },
    { email: 'restaurant2', name: '김밥천국', password: hashesPassword },
  ];

  for (const restaurant of dummyRestaurants) {
    const exists = await restaurantRepository.findOne({
      where: { email: restaurant.email },
    });

    if (!exists) {
      await restaurantRepository.save(restaurantRepository.create(restaurant));
    }
  }

  console.log('Success Generate Restaurants seeded');
};
