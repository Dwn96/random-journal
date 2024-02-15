import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendJournal(
    destinationEmail: string,
    context: { recipientName: string; authorName: string; content: string },
  ) {
    await this.mailerService.sendMail({
      to: destinationEmail,
      subject: 'Daily Journal Entry',
      template: './journal',
      context: {
        recipientName: context.recipientName,
        author: context.authorName,
        content: context.content,
      },
    });
  }
}
