import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { USER_STATUS } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<Omit<{
        name: string;
        email: string;
        password: string;
        lastSeen: string | null;
        createdAt: string | null;
        id: string;
        status: import(".prisma/client").$Enums.USER_STATUS | null;
    }, "password">>;
    login(loginUserDto: LoginUserDto): Promise<{
        token: string;
    }>;
    findAll(sortBy: 'lastSeen' | 'name' | 'email', sortOrder?: 'asc' | 'desc'): Promise<Omit<{
        name: string;
        email: string;
        password: string;
        lastSeen: string | null;
        createdAt: string | null;
        id: string;
        status: import(".prisma/client").$Enums.USER_STATUS | null;
    }, "password">[]>;
    findOne(id: string): Promise<Omit<{
        name: string;
        email: string;
        password: string;
        lastSeen: string | null;
        createdAt: string | null;
        id: string;
        status: import(".prisma/client").$Enums.USER_STATUS | null;
    }, "password">>;
    updateUserStatus(ids: string | string[], status: USER_STATUS): Promise<{
        message: string;
    }>;
    removeMany(ids: string | string[]): Promise<{
        message: string;
    }>;
}
