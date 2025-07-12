import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function promoteUserToAdmin(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.error(`❌ User with Clerk ID ${clerkId} not found`);
      return;
    }

    if (user.role === 'ADMIN') {
      console.log(`✅ User ${user.username} is already an admin`);
      return;
    }

    await prisma.user.update({
      where: { clerkId },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Successfully promoted ${user.username} to admin role`);
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get Clerk ID from command line argument
const clerkId = process.argv[2];

if (!clerkId) {
  console.error('❌ Please provide a Clerk ID as an argument');
  console.log('Usage: npx tsx scripts/promote-admin.ts <clerk_id>');
  process.exit(1);
}

promoteUserToAdmin(clerkId);
