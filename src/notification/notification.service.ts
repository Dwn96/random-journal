import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  triggerNotifications() {
    // console.log('Called!!!');
  }
}
