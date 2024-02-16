import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Journal } from 'src/journal/entities/journal.entity';
import { JournalService } from 'src/journal/journal.service';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
  ) {}
  @Cron('0 12 * * *', {
    timeZone: 'Africa/Nairobi',
  })
  async triggerMailNotifications() {
    const users = await this.userRepository.find();
    for (const user of users) {
      const { last_journal_entry_date, last_emailed_on } = user;
      if (!last_journal_entry_date) continue;
      const currentDatetime = moment();
      const lastJournalDateForUser = moment(last_journal_entry_date);
      const lastEmailedDate = moment(last_emailed_on);

      const durationBetweenLastJournal = moment.duration(
        currentDatetime.diff(lastJournalDateForUser),
      );
      const timeDiff = durationBetweenLastJournal.asDays();

      const durationBetweenLastEmailed = moment.duration(
        currentDatetime.diff(lastEmailedDate),
      );
      const daysBetweenLastEmail = durationBetweenLastEmailed.asDays();

      if (timeDiff >= 1 || daysBetweenLastEmail <= 1) return;

      const yesterday = moment().subtract(1, 'days').toDate();
      const recentJournal = await this.journalRepository.findOneBy({
        created_at: MoreThanOrEqual(yesterday),
        user: {
          id: Not(user.id),
        },
      });
      if (!recentJournal) return;
      console.log(user);
      console.log(recentJournal);
      const author = await this.userRepository.findOneBy({id:recentJournal.created_by});

      console.log(author);
      await this.mailService.sendJournal(user.email, {
        recipientName: user.username,
        authorName: author.username,
        content: recentJournal.content,
      });
      await this.userRepository.update(user.id, {
        last_emailed_on: moment().toISOString(),
      });
      console.log('Done');
    }
  }
}
