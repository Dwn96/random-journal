import { Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { LessThan, Repository, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as moment from 'moment'

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
    private readonly userService: UserService,
  ) {}
  async create(createJournalDto: CreateJournalDto) {
    const user = await this.userService.findOne(createJournalDto.created_by);
    console.log(user)
    const journal = new Journal(this.userService);
    journal.user = user;
    journal.content = createJournalDto.content;
    journal.created_by = createJournalDto.created_by;
    const createdJournal = await this.journalRepository.save(createJournalDto);
    const now = new Date().toLocaleString()
    await this.userService.update(user.id, {
      last_journal_entry_date: moment().toISOString(),
    });
    return createdJournal;
  }

  async findJournalsByUserId(userId: number) {
    await this.userService.findOne(userId);
    const journals = await this.journalRepository.findBy({
      created_by: userId,
    });
    return journals;
  }

  async getRandomJournal(userId:number) {
    const yesterday = moment().subtract(1, 'days').toDate()
    const journal = await this.journalRepository.findOneBy({
      created_at: MoreThanOrEqual(yesterday),
      user: {
        id: Not(userId)
      }
    })
    return journal
  }
}
