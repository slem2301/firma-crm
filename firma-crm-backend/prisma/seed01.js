const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN' },
    })

    const managerRole = await prisma.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: { name: 'MANAGER' },
    })

    const user = await prisma.user.upsert({
        where: { email: 'admin@crm.local' },
        update: {},
        create: { email: 'admin@crm.local', name: 'Admin User' },
    })

    await prisma.userRole.createMany({
        data: [
            { userId: user.id, roleId: adminRole.id },
            { userId: user.id, roleId: managerRole.id },
        ],
        skipDuplicates: true,
    })

    await prisma.order.createMany({
        data: Array.from({ length: 15 }).map((_, i) => ({
            orderNumber: `ORD-${1000 + i}`,
            project: ['Kitchen', 'Bathroom', 'Windows'][i % 3],
            total: 100 + i * 20,
            dealerKickback: i % 4 === 0 ? 0 : 10,
        })),
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
