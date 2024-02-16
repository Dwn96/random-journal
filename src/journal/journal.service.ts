import { Injectable, Inject } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { LessThan, Repository, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as moment from 'moment';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async create(createJournalDto: CreateJournalDto) {
    const { email } = (this.request as any).user;
    const user = await this.userService.findUserBy({ email });
    const journal = {
      created_by: user.id,
      content: createJournalDto.content,
    };
    const createdJournal = await this.journalRepository.save(journal);
    const now = new Date().toLocaleString();
    await this.userService.update(user.id, {
      last_journal_entry_date: moment().toISOString(),
    });
    return createdJournal;
  }

  async findJournalsByUserId(userId?: number) {
    let userIdFilter = userId
    if(!userIdFilter) {
      const { email } = (this.request as any).user;
      const user = await this.userService.findUserBy({ email });
      userIdFilter = user.id
    }
    const journals = await this.journalRepository.findBy({
      created_by: userIdFilter,
    });
    return journals;
  }

  async getRandomJournal(userId: number) {
    const yesterday = moment().subtract(1, 'days').toDate();
    const journal = await this.journalRepository.findOneBy({
      created_at: MoreThanOrEqual(yesterday),
      user: {
        id: Not(userId),
      },
    });
    return journal;
  }
}
