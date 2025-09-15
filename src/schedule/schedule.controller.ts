import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from 'src/shared/guards/jwt.guard';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
} from './dto/schedule-request.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() dto: CreateScheduleDto,
    @Req() req,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.create(dto, req.user);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
    @Req() req,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.update(id, dto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.scheduleService.delete(id);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.getOne(id);
  }

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: keyof ScheduleResponseDto,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.getAll(search, sortBy, order);
  }
}
