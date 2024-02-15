import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('journal')
export class Journal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  created_by: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.journals)
  @JoinColumn({ name: 'created_by' })
  user: User;
}
