import { Injectable } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
    private readonly userService: UserService,
  ) {}
  async create(createJournalDto: CreateJournalDto) {
    await this.userService.findOne(createJournalDto.created_by);
    const journal = await this.journalRepository.save(createJournalDto);
    return journal;
  }

  async findJournalsByUserId(userId: number) {
    await this.userService.findOne(userId);
    const journals = await this.journalRepository.findBy({
      created_by: userId,
    });
    return journals;
  }
}
