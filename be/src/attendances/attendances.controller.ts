import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { multerConfig } from '../config/multer.config';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @Roles('EMPLOYEE', 'ADMIN')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAttendanceDto,
    @Req() req: Request & { user: any },
  ) {
    if (!file) throw new BadRequestException('Photo is required');
    return this.attendancesService.create(
      req.user.sub,
      dto,
      `/uploads/attendances/${file.filename}`,
    );
  }

  @Get('me')
  @Roles('EMPLOYEE', 'ADMIN')
  findMine(
    @Req() req: Request & { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.attendancesService.findByEmployee(req.user.sub, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get()
  @Roles('ADMIN')
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.attendancesService.findAll({
      employeeId: employeeId ? parseInt(employeeId, 10) : undefined,
      dateFrom,
      dateTo,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request & { user: any }) {
    const attendance = await this.attendancesService.findById(id);
    // allow if admin or owner
    if (
      req.user.role !== 'ADMIN' &&
      attendance.employee.id !== req.user.sub
    ) {
      throw new ForbiddenException();
    }
    return attendance;
  }
}
