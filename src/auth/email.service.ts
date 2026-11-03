import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from './templates/templates';
@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendVerificationEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${token}`;
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: verifyEmailTemplate(verificationUrl),
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const resetUrl = `${appUrl}/api/auth/reset-password?token=${token}`;
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: resetPasswordTemplate(resetUrl),
    });
  }
}
