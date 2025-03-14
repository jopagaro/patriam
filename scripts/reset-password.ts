import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const username = 'jopagaro';
    const newPassword = 'qwerty123'; // New password

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
      where: { username },
      data: { passwordHash },
    });

    console.log('Password reset successful for user:', user.username);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword(); 