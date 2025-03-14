import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  try {
    const username = 'jopagaro';
    const password = 'qwerty123';
    const email = 'rocoroche13@gmail.com';

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'ADMIN',
      },
    });

    console.log('User created successfully:', user.username);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 