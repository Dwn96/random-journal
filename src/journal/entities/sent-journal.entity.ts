import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Journal } from './journal.entity';
import { User } from 'src/user/entities/user.entity';

enum Status {
  SUCCESS = 'success',
  FAIL = 'fail',
  IN_PROGRESS = 'in_progress',
}

@Entity('sent_journal')
export class SentJournal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  journal_id: number;

  @ManyToOne(() => Journal)
  @JoinColumn({ name: 'journal_id' })
  journal: Journal;

  @Column()
  recipient_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: string;
}
