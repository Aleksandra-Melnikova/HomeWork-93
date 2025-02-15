import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../shemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: string | undefined = req.get('Authorization');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const user: UserDocument | null = await this.userModel.findOne({ token });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      req.user = user;
      return true;
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }
    req.user = user;
    return true;
  }
}
