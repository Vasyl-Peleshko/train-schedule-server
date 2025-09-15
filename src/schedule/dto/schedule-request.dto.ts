export class CreateScheduleDto {
  train_number: string;
  origin: string;
  destination: string;
  departure_time: Date;
  arrival_time: Date;
  status?: string;
}

export class UpdateScheduleDto {
  train_number?: string;
  origin?: string;
  destination?: string;
  departure_time?: Date;
  arrival_time?: Date;
  status?: string;
}
