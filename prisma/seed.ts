const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Timiclassic database...');

  // 1. Clean existing records
  await prisma.communication.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.garment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Hash passwords
  const hashedDesignerPassword = await bcrypt.hash('password123', 10);
  const hashedClientPassword = await bcrypt.hash('client123', 10);

  // 3. Create Admin Designer
  const designer = await prisma.user.create({
    data: {
      name: 'Timi Classic',
      email: 'designer@timiclassic.com',
      password: hashedDesignerPassword,
      role: 'ADMIN',
    },
  });

  console.log('Designer created:', designer.email);

  // 4. Create Client
  const client = await prisma.client.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'client@gmail.com',
      phone: '+1 555-0199',
      address: '742 Evergreen Terrace, Luxury Valley',
      notes: 'Prefers silk and lightweight satin lining. Fits true to size, hates synthetic blends.',
      portalPassword: hashedClientPassword,
      userId: designer.id,
      measurements: {
        sets: [
          {
            date: '2026-07-01',
            chest: 36,
            waist: 28,
            hips: 38,
            shoulder: 15,
            sleeve: 22,
            custom: 'Height: 5\'8", Hollow to Hem: 56"',
          },
        ],
        photos: [],
      },
    },
  });

  console.log('Client created:', client.firstName);

  // 5. Create Order
  const orderDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(orderDate.getDate() + 20); // 20 days due

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-001',
      clientId: client.id,
      status: 'SEWING',
      priority: 'HIGH',
      totalAmount: 2400.0,
      depositPaid: 1200.0,
      depositDate: orderDate,
      balanceDue: 1200.0,
      dueDate: dueDate,
      notes: 'Bespoke bridal dress. Requires double silk lining. Delicate hand sewing on the cuffs.',
      userId: designer.id,
      garments: {
        create: [
          {
            name: 'Silk Wedding Gown',
            description: 'Elegant floor-length silk wedding gown with draped back details',
            fabricType: 'Silk Crepe / Satin',
            color: 'Ivory White',
            pattern: 'pattern-gown-v1.pdf',
          },
        ],
      },
    },
    include: {
      garments: true,
    },
  });

  console.log('Order created:', order.orderNumber);

  // 6. Create Tasks for the Order
  const garment = order.garments[0];

  const task1 = await prisma.task.create({
    data: {
      title: 'Source Ivory Silk Satin',
      description: 'Acquire 6 yards of heavy silk crepe and satin lining from fabric merchant',
      status: 'DONE',
      priority: 'HIGH',
      orderId: order.id,
      garmentId: garment.id,
      assignedTo: designer.id,
      dueDate: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      timeSpent: 3.5,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Drape back pattern bodice',
      description: 'Drape bodice shapes on mannequin using client measurements',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      orderId: order.id,
      garmentId: garment.id,
      assignedTo: designer.id,
      dueDate: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      timeSpent: 2.0,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'First client fitting session',
      description: 'Fit mock muslin mockup on Sarah to adjust armholes and waist seams',
      status: 'TODO',
      priority: 'MEDIUM',
      orderId: order.id,
      garmentId: garment.id,
      assignedTo: designer.id,
      dueDate: new Date(orderDate.getTime() + 10 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Tasks seeded successfully!');

  // 7. Seed sample communication
  await prisma.communication.create({
    data: {
      type: 'EMAIL',
      direction: 'OUTBOUND',
      subject: 'Deposit payment logged',
      content: 'Dear Sarah, We have successfully logged your deposit payment of $1,200.00. Work is now beginning on your Silk Gown! We will contact you soon for fitting.',
      clientId: client.id,
      orderId: order.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
