import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { ITokenPair, ILogin } from 'src/shared/interfaces/auth.interface';
import { CreateUserDto } from './dto/user-request.dto';
import { AuthGuard } from 'src/shared/guards/jwt.guard';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto): Promise<ITokenPair> {
    return this.userService.register(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: ILogin): Promise<ITokenPair> {
    return this.userService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokenPair> {
    return this.userService.refresh(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('getUser')
  async getUser(@Req() req): Promise<UserResponseDto> {
    return this.userService.getUser(req.user);
  }
}
