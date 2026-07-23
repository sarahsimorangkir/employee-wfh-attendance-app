import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Employee } from './employees/entities/employee.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import 'dotenv/config';

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Employee, Attendance],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  });
  await ds.initialize();

  const repo = ds.getRepository(Employee);
  const exists = await repo.findOneBy({ email: 'admin@company.com' });
  if (!exists) {
    await repo.save(
      repo.create({
        employeeCode: 'ADM001',
        fullName: 'HRD Admin',
        email: 'admin@company.com',
        password: await bcrypt.hash('Admin123!', 10),
        role: 'ADMIN',
      }),
    );
    console.log('Admin seeded: admin@company.com / Admin123!');
  } else {
    console.log('Admin already exists, skipping.');
  }
  await ds.destroy();
}
seed();
