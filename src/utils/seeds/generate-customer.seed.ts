import { DataSource } from 'typeorm';
import { Customer } from '../../entity/customer.entity';
import { hash } from 'bcrypt';

export const generateCustomers = async (dataSource: DataSource) => {
  const customerRepository = dataSource.getRepository(Customer);

  const hashesPassword = await hash('1234', 10);

  const dummyCustomers = [
    { email: 'customer1', name: '홍길동', password: hashesPassword },
    { email: 'customer2', name: '김영희', password: hashesPassword },
    { email: 'customer3', name: '이철수', password: hashesPassword },
  ];

  for (const customer of dummyCustomers) {
    const exists = await customerRepository.findOne({
      where: { email: customer.email },
    });

    if (!exists) {
      await customerRepository.save(customerRepository.create(customer));
    }
  }

  console.log('Success Generate Customers seeded');
};
