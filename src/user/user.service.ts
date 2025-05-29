import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User, USER_STATUS } from '@prisma/client';
import { getTransformedTime } from 'src/helpers';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      const { password, lastSeen, createdAt, ...rest } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          lastSeen: getTransformedTime(),
          createdAt: getTransformedTime(),
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('User already registered');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('This user is not registered!');
      }

      if (user.status === USER_STATUS.BLOCKED) {
        throw new BadRequestException('This user is blocked');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Wrong credentials!');
      }

      const token = await this.generateAccessToken({ id: user.id });
      return { token };
    } catch (error) {
      throw error;
    }
  }

  async generateAccessToken(payload: { id: string }): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '1d',
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          email: sortOrder,
        },
      });

      return users.map(({ password, ...rest }) => rest);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(ids: string[], status: USER_STATUS) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('User ID list is required');
      }

      let updated = await this.prisma.user.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          status,
        },
      });
      return {
        message: `${updated.count} users updated successfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeMany(ids: string[]): Promise<{ message: string }> {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No user IDs provided');
      }

      const existingUsers = await this.prisma.user.findMany({
        where: { id: { in: ids } },
      });

      if (existingUsers.length === 0) {
        throw new NotFoundException('No matching users found to delete');
      }

      const deleted = await this.prisma.user.deleteMany({
        where: { id: { in: ids } },
      });

      return { message: `${deleted.count} user(s) successfully deleted!` };
    } catch (error) {
      throw error;
    }
  }
}
