import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository, ILike } from 'typeorm';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
} from './dto/schedule-request.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(
    dto: CreateScheduleDto,
    user: User,
  ): Promise<ScheduleResponseDto> {
    const schedule = this.scheduleRepository.create({
      ...dto,
      created_by: user,
      updated_by: user,
    });
    await this.scheduleRepository.save(schedule);
    return new ScheduleResponseDto(schedule);
  }

  async update(
    id: number,
    dto: UpdateScheduleDto,
    user: User,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');

    Object.assign(schedule, dto, { updated_by: user });
    await this.scheduleRepository.save(schedule);
    return new ScheduleResponseDto(schedule);
  }

  async delete(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Schedule not found');
  }

  async getOne(id: number): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['created_by', 'updated_by'],
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return new ScheduleResponseDto({
      ...schedule,
      created_by: schedule.created_by
        ? { id: schedule.created_by.id, username: schedule.created_by.username }
        : undefined,
      updated_by: schedule.updated_by
        ? { id: schedule.updated_by.id, username: schedule.updated_by.username }
        : undefined,
    });
  }

  async getAll(
    search?: string,
    sortBy: keyof Schedule = 'departure_time',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ScheduleResponseDto[]> {
    const where = search
      ? [
          { train_number: ILike(`%${search}%`) },
          { origin: ILike(`%${search}%`) },
          { destination: ILike(`%${search}%`) },
        ]
      : {};
    const schedules = await this.scheduleRepository.find({
      where,
      order: { [sortBy]: order },
      relations: ['created_by', 'updated_by'],
    });

    return schedules.map(
      (s) =>
        new ScheduleResponseDto({
          ...s,
          created_by: s.created_by
            ? { id: s.created_by.id, username: s.created_by.username }
            : undefined,
          updated_by: s.updated_by
            ? { id: s.updated_by.id, username: s.updated_by.username }
            : undefined,
        }),
    );
  }
}
