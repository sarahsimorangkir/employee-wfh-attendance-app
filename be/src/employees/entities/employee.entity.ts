import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Attendance } from '../../attendances/entities/attendance.entity';

@Entity('employees')
@Check(`"role" IN ('EMPLOYEE', 'ADMIN')`)
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  employeeCode: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 10, default: 'EMPLOYEE' })
  role: 'EMPLOYEE' | 'ADMIN';

  @Column({ nullable: true, length: 50 })
  department?: string;

  @Column({ nullable: true, length: 50 })
  position?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Attendance, (a) => a.employee)
  attendances: Attendance[];
}
