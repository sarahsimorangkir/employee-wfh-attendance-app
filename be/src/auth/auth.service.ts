import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const employee = await this.employeesService.findByEmail(email);
    if (!employee || !employee.isActive)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, employee.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: employee.id,
      role: employee.role,
      email: employee.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
      },
    };
  }
}
