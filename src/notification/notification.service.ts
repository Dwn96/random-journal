import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
      const currentDateTime = new Date();
      const last_journal_entry_date = user.last_journal_entry_date;

      // Calculate the time 24 hours ago
      const twentyFourHoursAgo = new Date(
        currentDateTime.getTime() - 24 * 60 * 60 * 1000,
      );

      const userPostWithinLastDay =
        last_journal_entry_date >= twentyFourHoursAgo &&
        last_journal_entry_date <= currentDateTime;

      if (!userPostWithinLastDay) return;
    }
  }
}
