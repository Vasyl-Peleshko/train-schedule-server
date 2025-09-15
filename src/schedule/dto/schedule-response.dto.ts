export class ScheduleResponseDto {
  id: number;
  train_number: string;
  origin: string;
  destination: string;
  departure_time: Date;
  arrival_time: Date;
  status: string;
  created_by?: { id: number; username: string };
  updated_by?: { id: number; username: string };
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<ScheduleResponseDto>) {
    Object.assign(this, partial);
  }
}
