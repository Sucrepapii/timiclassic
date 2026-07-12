const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const dbUrlMatch = env.split('\n').find(l => l.startsWith('DATABASE_URL'));
if (dbUrlMatch) {
  process.env.DATABASE_URL = dbUrlMatch.substring(dbUrlMatch.indexOf('=') + 1).replace(/'|"/g, '').trim();
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany();
  console.log("Users:");
  console.log(users.map(u => ({ email: u.email, role: u.role, needsChange: u.needsPasswordChange })));

  const clients = await prisma.client.findMany();
  console.log("Clients:");
  console.log(clients.map(c => ({ email: c.email, needsChange: c.needsPasswordChange })));
}

run().finally(() => prisma.$disconnect());
