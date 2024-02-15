import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { JournalModule } from './journal/journal.module';
import { NotificationService } from './notification/notification.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JournalService } from './journal/journal.service';
import { Journal } from './journal/entities/journal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    DatabaseModule,
    JournalModule,
    AuthModule,
    MailModule,
    NotificationModule,
    TypeOrmModule.forFeature([User, Journal])
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService, UserService, JournalService],
})
export class AppModule {}
