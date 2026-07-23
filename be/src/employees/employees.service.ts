import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const hashed = await bcrypt.hash(dto.password, 10);
    const employee = this.repo.create({ ...dto, password: hashed });

    try {
      return await this.repo.save(employee);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('Email or employee code already exists');
      }
      throw err;
    }
  }

  async findAll(query: { search?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = query.search
      ? [
          { fullName: ILike(`%${query.search}%`) },
          { email: ILike(`%${query.search}%`) },
          { employeeCode: ILike(`%${query.search}%`) },
        ]
      : undefined;

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      select: [
        'id',
        'employeeCode',
        'fullName',
        'email',
        'role',
        'department',
        'position',
        'isActive',
        'createdAt',
      ],
    });

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Employee> {
    const employee = await this.repo.findOne({
      where: { id },
      select: [
        'id',
        'employeeCode',
        'fullName',
        'email',
        'role',
        'department',
        'position',
        'isActive',
        'createdAt',
      ],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.repo.findOneBy({ id });
    if (!employee) throw new NotFoundException('Employee not found');

    Object.assign(employee, dto);

    try {
      return await this.repo.save(employee);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('Email or employee code already exists');
      }
      throw err;
    }
  }

  async deactivate(id: number): Promise<void> {
    const employee = await this.repo.findOneBy({ id });
    if (!employee) throw new NotFoundException('Employee not found');
    employee.isActive = false;
    await this.repo.save(employee);
  }
}
