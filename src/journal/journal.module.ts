import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { User } from 'src/user/entities/user.entity';
import { Journal } from './entities/journal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [JournalController],
  providers: [JournalService, UserService],
  imports: [TypeOrmModule.forFeature([User, Journal])],
})
export class JournalModule {}
