import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default tags
  const defaultTags = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'HTML',
    'CSS',
    'Database',
    'SQL',
    'NoSQL',
    'API',
    'Frontend',
    'Backend',
    'Full Stack',
    'Bug',
    'Help',
    'Tutorial',
    'Best Practices',
    'Performance',
    'Security',
    'Testing',
    'Deployment',
    'Git',
    'Docker',
  ];

  for (const tagName of defaultTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  console.log(`✅ Created ${defaultTags.length} default tags`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
