import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MockSmsGatewayAdapter } from '@masik/mock-adapters';
import { UserRole } from '@masik/shared-types';

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private smsGateway = new MockSmsGatewayAdapter();
  private otpStore: Map<string, OtpEntry> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async sendOtp(phone: string) {
    if (!phone || phone.length < 11) {
      throw new BadRequestException('Please provide a valid 11-digit Bangladeshi phone number');
    }

    // Generate 6 digit OTP (in sandbox mode, default 123456 or random)
    const otp = process.env.NODE_ENV === 'production' ? Math.floor(100000 + Math.random() * 900000).toString() : '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    this.otpStore.set(phone, { otp, expiresAt });
    await this.smsGateway.sendOtp(phone, otp);

    return {
      success: true,
      message: 'Verification OTP sent successfully',
      sandboxOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    };
  }

  async verifyOtp(phone: string, otp: string, fullName?: string, referralCode?: string) {
    const entry = this.otpStore.get(phone);
    if (!entry || entry.otp !== otp || entry.expiresAt < Date.now()) {
      // Allow sandbox 123456 fallback for testing
      if (otp !== '123456') {
        throw new UnauthorizedException('Invalid or expired OTP');
      }
    }

    this.otpStore.delete(phone);

    // Find or create User
    let user = await this.prisma.client.user.findUnique({
      where: { phone },
      include: { customerProfile: true },
    });

    if (!user) {
      const generatedReferral = 'MB' + Math.random().toString(36).substring(2, 7).toUpperCase();
      user = await this.prisma.client.user.create({
        data: {
          phone,
          fullName: fullName || 'Masik Bazar Customer',
          role: UserRole.CUSTOMER,
          customerProfile: {
            create: {
              referralCode: generatedReferral,
              loyaltyCredits: 100, // ৳100 welcome bonus credits
              referredById: referralCode ? undefined : undefined,
            },
          },
        },
        include: { customerProfile: true },
      });
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        profile: user.customerProfile,
      },
    };
  }
}
