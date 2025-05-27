import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService
  ) { }

  
  async canActivate(context: ExecutionContext): Promise<boolean> {

    let request: Request = context.switchToHttp().getRequest()
    let token = request.headers.authorization?.split(' ')[1]
    
    if (!token) throw new UnauthorizedException("Not found token")
      
      let data = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET })
      request['user'] = data
      
      try {
      await this.prisma.user.update({
        where: { id: data.id },
        data: { lastSeen: new Date() },
      });

      return true
    } catch (error) {
      throw new UnauthorizedException("not found token")
    }
  }
}
