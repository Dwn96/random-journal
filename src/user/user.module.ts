import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Journal } from 'src/journal/entities/journal.entity';
import { JournalService } from 'src/journal/journal.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JournalService],
  imports: [TypeOrmModule.forFeature([User, Journal])],
})
export class UserModule {}
