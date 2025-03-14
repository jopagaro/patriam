import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // First clear any existing users
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN',
    },
    {
      username: 'jopagaro',
      email: 'rocoroche13@gmail.com',
      password: 'qwerty123',
      role: 'ADMIN',
    },
    // Add more users here as needed
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        username: user.username.toLowerCase(),
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
    console.log(`Created user: ${createdUser.username}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
