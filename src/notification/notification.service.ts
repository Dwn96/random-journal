import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { JournalService } from 'src/journal/journal.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly journalService: JournalService
  ) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async triggerMailNotifications() {
    const users = await this.userService.findAll();
    for (const user of users) {
      const {last_journal_entry_date, last_emailed_on} = user
      if(!last_journal_entry_date) continue
      const currentDatetime = moment();
      const lastJournalDateForUser = moment(last_journal_entry_date)
      const lastEmailedDate = moment(last_emailed_on)

      const durationBetweenLastJournal = moment.duration(currentDatetime.diff(lastJournalDateForUser))
      const timeDiff = durationBetweenLastJournal.asDays()

      const durationBetweenLastEmailed = moment.duration(currentDatetime.diff(lastEmailedDate))
      const daysBetweenLastEmail = durationBetweenLastEmailed.asDays()

      if(timeDiff >= 1 || daysBetweenLastEmail <= 1) return;

      const recentJournal = await this.journalService.getRandomJournal(user.id)
      if(!recentJournal) return
      console.log(user)
      console.log(recentJournal)
      const author = await this.userService.findOne(recentJournal.created_by)

      console.log(author)
      await this.mailService.sendJournal(user.email, {
        recipientName: user.username,
        authorName: author.username,
        content: recentJournal.content
      })
      await this.userService.update(user.id, {last_emailed_on: moment().toISOString()})
      console.log('Done')
    }
  }
}
