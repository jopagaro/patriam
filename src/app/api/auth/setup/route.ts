import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('123', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        passwordHash,
        role: 'ADMIN',
      },
    });

    const { passwordHash: _, ...adminWithoutPassword } = admin;
    return NextResponse.json(
      { message: 'Admin user created successfully', user: adminWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during setup' },
      { status: 500 }
    );
  }
} 