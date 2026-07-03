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
  const password = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.findFirst();
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: password }
    });
    console.log('Admin password reset to password123 for:', admin.email);
  }
}

main().finally(() => prisma.$disconnect());
