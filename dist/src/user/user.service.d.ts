import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User, USER_STATUS } from '@prisma/client';
export declare class UserService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    login(loginUserDto: LoginUserDto): Promise<{
        token: string;
    }>;
    generateAccessToken(payload: {
        id: string;
    }): Promise<string>;
    findAll(sortBy?: 'lastSeen' | 'name' | 'email', sortOrder?: 'asc' | 'desc'): Promise<Omit<User, 'password'>[]>;
    findOne(id: string): Promise<Omit<User, 'password'>>;
    updateUserStatus(ids: string[], status: USER_STATUS): Promise<{
        message: string;
    }>;
    removeMany(ids: string[]): Promise<{
        message: string;
    }>;
}
