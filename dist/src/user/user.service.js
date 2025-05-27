"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        try {
            const { password, ...rest } = createUserDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: { ...rest, password: hashedPassword },
            });
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw error;
        }
    }
    async login(loginUserDto) {
        try {
            const { email, password } = loginUserDto;
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new common_1.NotFoundException('This user is not registered!');
            }
            if (user.status === client_1.USER_STATUS.BLOCKED) {
                throw new common_1.BadRequestException("This user is blocked");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Wrong credentials!');
            }
            const token = await this.generateAccessToken({ id: user.id });
            return { token };
        }
        catch (error) {
            throw error;
        }
    }
    async generateAccessToken(payload) {
        try {
            return await this.jwtService.signAsync(payload, {
                secret: process.env.ACCESS_SECRET,
                expiresIn: '1d',
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(sortBy, sortOrder = 'asc') {
        try {
            const validSortFields = ['lastSeen', 'name', 'email'];
            const orderBy = sortBy && validSortFields.includes(sortBy)
                ? { [sortBy]: sortOrder }
                : undefined;
            const users = await this.prisma.user.findMany({
                orderBy,
            });
            return users.map(({ password, ...rest }) => rest);
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw error;
        }
    }
    async updateUserStatus(ids, status) {
        try {
            if (!ids || ids.length === 0) {
                throw new Error('User ID list is required');
            }
            let updated = await this.prisma.user.updateMany({
                where: {
                    id: {
                        in: ids
                    },
                },
                data: {
                    status
                }
            });
            return {
                message: `${updated.count} users updated successfully`
            };
        }
        catch (error) {
            throw error;
        }
    }
    async removeMany(ids) {
        try {
            if (!ids || ids.length === 0) {
                throw new Error('No user IDs provided');
            }
            const existingUsers = await this.prisma.user.findMany({
                where: { id: { in: ids } }
            });
            if (existingUsers.length === 0) {
                throw new common_1.NotFoundException('No matching users found to delete');
            }
            const deleted = await this.prisma.user.deleteMany({
                where: { id: { in: ids } }
            });
            return { message: `${deleted.count} user(s) successfully deleted!` };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map