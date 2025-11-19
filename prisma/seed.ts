import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function main() {
  const email = process.env.MAJOR_ADMIN_EMAIL;
  const password = process.env.MAJOR_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('MAJOR_ADMIN_EMAIL and MAJOR_ADMIN_PASSWORD must be set');
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, displayName: 'Major', role: 'ADMIN' },
    create: {
      email,
      passwordHash,
      displayName: 'Major',
      role: 'ADMIN',
    },
  });

  console.info('Admin user ensured.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
