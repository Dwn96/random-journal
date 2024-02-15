import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JournalService } from 'src/journal/journal.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly journalService: JournalService,
  ) {}

  @Post()
  @SetMetadata('isPublic', true)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':id/journal')
  getJournalsByUserId(@Param('id') id: string) {
    return this.journalService.findJournalsByUserId(+id);
  }
}
