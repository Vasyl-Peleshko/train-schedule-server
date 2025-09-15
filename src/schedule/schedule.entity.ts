import { User } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  train_number: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamp' })
  departure_time: Date;

  @Column({ type: 'timestamp' })
  arrival_time: Date;

  @Column({ default: 'on-time' })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  created_by: User;

  @ManyToOne(() => User, { nullable: true })
  updated_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
