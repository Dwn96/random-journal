import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async create({ email, username, password }: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`User with email ${email} exists`);
    }
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    const { password: _, ...userDetails } =
      await this.userRepository.save(user);
    return userDetails;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return user;
  }

  async findUserBy({
    last_journal_entry_date,
    last_emailed_on,
    ...findOptions
  }: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: findOptions,
      select: ['email', 'password', 'username', 'id'],
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getLoggedInUser() {
    const { email } = (this.request as any).user;
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
