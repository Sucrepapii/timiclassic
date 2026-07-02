const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const dbUrlMatch = env.split('\n').find(l => l.startsWith('DATABASE_URL'));
if (dbUrlMatch) {
  process.env.DATABASE_URL = dbUrlMatch.substring(dbUrlMatch.indexOf('=') + 1).replace(/'|"/g, '').trim();
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updatedClient = await prisma.client.update({
    where: { email: 'client@gmail.com' },
    data: {
      firstName: 'Sarah',
      lastName: 'Jenkins'
    }
  });
  console.log('Client updated:', updatedClient.email, '->', updatedClient.firstName, updatedClient.lastName);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
