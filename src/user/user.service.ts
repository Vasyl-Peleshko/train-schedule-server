import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user-request.dto';
import { ILogin, ITokenPair } from 'src/shared/interfaces/auth.interface';
import { ITokenPayload } from 'src/shared/interfaces/jwt.interface';
import { Roles } from 'src/shared/enums/roles.enum';
import { compareHash, createHash } from 'src/shared/utils/hashing.util';
import { generateToken, decodeToken } from 'src/shared/utils/jwt.utils';
import { TokenType } from 'src/shared/enums/jwt.enum';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async register(userDto: CreateUserDto): Promise<ITokenPair> {
    const foundUser = await this.usersRepository.findOne({
      where: { email: userDto.email },
    });
    if (foundUser) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await createHash(userDto.password);
    const user = this.usersRepository.create({
      username: userDto.username,
      email: userDto.email,
      password_hash: hashedPassword,
      role: Roles.BUYER,
    });
    await this.usersRepository.save(user);

    const tokenPayload: ITokenPayload = {
      id: user.id,
      role: user.role,
    };
    return this.generateSession(user, tokenPayload);
  }

  public async login(user: ILogin): Promise<ITokenPair> {
    const foundUser = await this.usersRepository.findOne({
      where: { email: user.email },
      select: ['id', 'password_hash', 'role', 'refresh_token'],
    });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const isValid = await compareHash(user.password, foundUser.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Wrong password.');
    }

    const tokenPayload: ITokenPayload = {
      id: foundUser.id,
      role: foundUser.role,
    };
    return this.generateSession(foundUser, tokenPayload);
  }

  public async refresh(refreshToken: string): Promise<ITokenPair> {
    const payload: ITokenPayload = decodeToken(refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
      select: ['id', 'role', 'refresh_token'],
    });

    if (!user || user.refresh_token !== refreshToken) {
      throw new ForbiddenException('Invalid refresh token.');
    }

    return this.generateSession(user, { id: user.id, role: user.role });
  }

  public async getUser(payload: ITokenPayload): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
      select: ['id', 'username', 'email', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  private async generateSession(
    user: User,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    const tokenPair = this.generateTokenPair(payload);

    user.refresh_token = tokenPair.refresh;
    await this.usersRepository.save(user);

    return tokenPair;
  }

  private generateTokenPair(payload: ITokenPayload): ITokenPair {
    const access = generateToken(payload, TokenType.ACCESS);
    const refresh = generateToken(payload, TokenType.REFRESH);
    return { access, refresh };
  }
}
