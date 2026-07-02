const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const dbUrlMatch = env.split('\n').find(l => l.startsWith('DATABASE_URL'));
if (dbUrlMatch) {
  process.env.DATABASE_URL = dbUrlMatch.substring(dbUrlMatch.indexOf('=') + 1).replace(/'|"/g, '').trim();
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    console.log("No admin user found.");
    return;
  }
  
  const password = await bcrypt.hash('password123', 10);
  
  const client = await prisma.client.upsert({
    where: { email: 'client@gmail.com' },
    update: { portalPassword: password, needsPasswordChange: true },
    create: {
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@gmail.com',
      portalPassword: password,
      needsPasswordChange: true,
      userId: admin.id
    }
  });
  
  console.log('Client successfully created/updated:', client.email);
  console.log('Use password: password123');
}

main().finally(() => prisma.$disconnect());
