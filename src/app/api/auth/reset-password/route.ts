import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, newPassword } = await request.json();

    if (!username || !newPassword) {
      return NextResponse.json(
        { error: 'Username and new password are required' },
        { status: 400 }
      );
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
      where: { username },
      data: { passwordHash },
    });

    // Don't send the password hash back
    const { passwordHash: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: 'Password updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 