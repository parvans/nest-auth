import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { User } from 'src/db/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.getByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24 Hrs from now

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });

    void this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message:
        'Registration Successful. Please check you email to verify your account',
    };
  }

  async verifyEmail(token: string, res: Response) {
    const user = await this.usersService.getByVerificationToken(token);

    if (!user || !user.verificationToken) {
      throw new UnauthorizedException('Invalid verification token.');
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Verification token has expired.');
    }

    await this.usersService.updateUser(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    const tokens = await this.generateAccessToken(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message: 'Email verified successfully.',
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto, res: Response) {
    const userExist = await this.usersService.getByEmail(dto.email);
    if (!userExist) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordVerify = await bcrypt.compare(
      dto.password,
      userExist.passwordHash,
    );

    if (!passwordVerify) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!userExist.isVerified) {
      throw new UnauthorizedException('Please verify your email before login.');
    }

    const tokens = await this.generateAccessToken(userExist);
    await this.saveRefreshToken(userExist.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
      },
    };
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    let payload = {
      sub: '' as string,
      email: '' as string,
    };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.usersService.getById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!tokenMatch) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const tokens = await this.generateAccessToken(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async logout(userId: string, res: Response) {
    await this.usersService.updateUser(userId, { refreshTokenHash: null });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully.' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await this.usersService.updateUser(user.id, {
      resetToken,
      resetTokenExpiresAt,
    });

    void this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        "If an account with that email exists, we've sent a password reset link.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.getByResetToken(token);

    if (!user || !user.resetToken) {
      throw new BadRequestException('Invalid reset token.');
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException(
        'Reset token has expired. Please request a new one.',
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.usersService.updateUser(user.id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
    });

    return { message: 'Password has been reset successfully.' };
  }

  private async generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }
  private async saveRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUser(userId, { refreshTokenHash });
  }
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
