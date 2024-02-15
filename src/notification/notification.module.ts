import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from 'src/journal/entities/journal.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [UserService, MailService],
  imports: [TypeOrmModule.forFeature([User, Journal])],
})
export class NotificationModule {}
