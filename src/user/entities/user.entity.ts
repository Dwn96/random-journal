import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Journal } from 'src/journal/entities/journal.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToMany(() => Journal, (journal) => journal.user)
  journals: Journal[];

  @Column({ nullable: true })
  last_journal_entry_date: Date;

  @Column({ nullable: true })
  last_emailed_on: Date;
}
