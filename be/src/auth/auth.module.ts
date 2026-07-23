import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    EmployeesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('JWT_SECRET') ||
          process.env.JWT_SECRET ||
          's3cr3t_jwt_k3y_f0r_wfh_att3ndanc3_app_2026',
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '8h') as any,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
