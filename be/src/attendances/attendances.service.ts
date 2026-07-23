import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}

  async create(
    employeeId: number,
    dto: CreateAttendanceDto,
    photoUrl: string,
  ): Promise<Attendance> {
    const now = new Date();
    const attendanceDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const attendance = this.repo.create({
      employee: { id: employeeId } as any,
      attendanceDate,
      checkInTime: now,
      photoUrl,
      notes: dto.notes,
      latitude: dto.latitude ? parseFloat(dto.latitude) : undefined,
      longitude: dto.longitude ? parseFloat(dto.longitude) : undefined,
    });

    try {
      return await this.repo.save(attendance);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('Already checked in today');
      }
      throw err;
    }
  }

  async findByEmployee(
    employeeId: number,
    query?: { page?: number; limit?: number },
  ) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repo.findAndCount({
      where: { employee: { id: employeeId } },
      order: { attendanceDate: 'DESC', checkInTime: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findAll(query: {
    employeeId?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .select([
        'attendance.id',
        'attendance.attendanceDate',
        'attendance.checkInTime',
        'attendance.photoUrl',
        'attendance.notes',
        'attendance.createdAt',
        'employee.id',
        'employee.fullName',
        'employee.employeeCode',
      ])
      .orderBy('attendance.attendanceDate', 'DESC')
      .addOrderBy('attendance.checkInTime', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.employeeId) {
      qb.andWhere('employee.id = :employeeId', {
        employeeId: query.employeeId,
      });
    }

    if (query.dateFrom) {
      qb.andWhere('attendance.attendanceDate >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }

    if (query.dateTo) {
      qb.andWhere('attendance.attendanceDate <= :dateTo', {
        dateTo: query.dateTo,
      });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Attendance> {
    const attendance = await this.repo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }
}
