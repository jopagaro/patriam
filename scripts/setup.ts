import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setup() {
  try {
    // Run migrations
    console.log('Running database migrations...');
    const { execSync } = require('child_process');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });

    // Run seed file to create all users
    console.log('Creating users...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setup(); 