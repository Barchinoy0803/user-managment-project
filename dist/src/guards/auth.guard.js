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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("src/prisma/prisma.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async canActivate(context) {
        let request = context.switchToHttp().getRequest();
        let token = request.headers.authorization?.split(' ')[1];
        if (!token)
            throw new common_1.UnauthorizedException("Not found token");
        let data = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET });
        request['user'] = data;
        try {
            await this.prisma.user.update({
                where: { id: data.id },
                data: { lastSeen: new Date() },
            });
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("not found token");
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map