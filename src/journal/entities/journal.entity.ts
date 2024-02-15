import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
  AfterInsert,
} from 'typeorm';

@Entity('journal')
export class Journal {
  constructor(private readonly userService: UserService) {}
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  created_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.journals)
  @JoinColumn({ name: 'created_by' })
  user: User;
}
