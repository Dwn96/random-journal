import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findUserBy({
      email: createAuthDto.email,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const passwordVerified = await argon2.verify(
      user.password,
      createAuthDto.password,
    );
    if (!passwordVerified) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = {
      username: user.username,
      email: user.email,
      userId: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
