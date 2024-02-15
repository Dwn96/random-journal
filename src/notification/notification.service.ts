import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async triggerMailNotifications() {
    const users = await this.userService.findAll();
    for (const user of users) {
      const {last_journal_entry_date} = user
      if(!last_journal_entry_date) continue
      const currentDatetime = moment();
      const lastJournalDateForUser = moment(last_journal_entry_date)

      const duration = moment.duration(currentDatetime.diff(lastJournalDateForUser))
      const timeDiff = duration.asDays()

      if(timeDiff >= 1) return;

      await this.mailService.sendJournal(user.email, {
        recipientName: user.username,
        authorName: "Rand",
        content: "This is a random blog"
      })
    }
  }
}
