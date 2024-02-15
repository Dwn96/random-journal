import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { JournalModule } from './journal/journal.module';
import { NotificationService } from './notification/notification.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    JournalModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
