import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all existing data
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

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

    console.log('Database reset complete');
    console.log('Admin user created:', admin.username);
  } catch (error) {
    console.error('Error during reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 