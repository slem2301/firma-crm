const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    // ===== ROLES =====
    const adminRole = await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });

    const managerRole = await prisma.role.upsert({
        where: { name: "MANAGER" },
        update: {},
        create: { name: "MANAGER" },
    });

    const dealerRole = await prisma.role.upsert({
        where: { name: "DEALER" },
        update: {},
        create: { name: "DEALER" },
    });

    // ===== ADMIN USER =====
    const adminEmail = "admin@test.com";
    const adminPassword = "NewPass123!"; // можешь поменять
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            // если юзер уже есть — не трогаем пароль автоматически
            // passwordHash: adminPasswordHash,
            isActive: true,
            name: "Admin User",
        },
        create: {
            email: adminEmail,
            name: "Admin User",
            passwordHash: adminPasswordHash,
            isActive: true,
        },
    });

    await prisma.userRole.createMany({
        data: [
            { userId: adminUser.id, roleId: adminRole.id },
            { userId: adminUser.id, roleId: managerRole.id },
        ],
        skipDuplicates: true,
    });

    // ===== (optional) DEALER ENTITY + DEALER USER =====
    // Если тебе пока не надо — можешь удалить этот блок
    const dealer = await prisma.dealer.upsert({
        where: { name: "Dealer #1" },
        update: { isActive: true },
        create: {
            name: "Dealer #1",
            isActive: true,
            defaultDealerKickback: 10,
            phone: "+1 (555) 000-0001",
            email: "dealer1@crm.local",
            notes: "Seed dealer",
            // createdAt/updatedAt сами выставятся
        },
    });

    const dealerPasswordHash = await bcrypt.hash("dealer1234", 10);

    const dealerUser = await prisma.user.upsert({
        where: { email: "dealer1@crm.local" },
        update: { isActive: true, dealerId: dealer.id, name: "Dealer One" },
        create: {
            email: "dealer1@crm.local",
            name: "Dealer One",
            passwordHash: dealerPasswordHash,
            isActive: true,
            dealerId: dealer.id,
        },
    });

    await prisma.userRole.createMany({
        data: [{ userId: dealerUser.id, roleId: dealerRole.id }],
        skipDuplicates: true,
    });


    // ===== ORDER STATUSES =====
    const statusNew = await prisma.orderStatus.upsert({
        where: { name: "ORDER" },
        update: {},
        create: { name: "ORDER" },
    });

    const statusInProgress = await prisma.orderStatus.upsert({
        where: { name: "PREORDER" },
        update: {},
        create: { name: "IN_PROGRESS" },
    });

    const statusDone = await prisma.orderStatus.upsert({
        where: { name: "REPEAT" },
        update: {},
        create: { name: "REPEAT" },
    });

    const statusCanceled = await prisma.orderStatus.upsert({
        where: { name: "DONE" },
        update: {},
        create: { name: "DONE" },
    });


    // ===== ORDERS (optional) =====
    const statuses = [statusNew, statusInProgress, statusDone, statusCanceled];

    await prisma.order.createMany({
        data: Array.from({ length: 15 }).map((_, i) => ({
            orderNumber: `ORD-${1000 + i}`,
            project: ["Kitchen", "Bathroom", "Windows"][i % 3],
            total: 100 + i * 20,
            dealerKickback: i % 4 === 0 ? 0 : 10,
            dealerId: i % 2 === 0 ? dealer.id : null,

            statusId: statuses[i % statuses.length].id, // ✅ ВОТ ОНО
        })),
    });

    // ===== PRICE VERSION + ROWS =====
    const v1 = await prisma.priceVersion.upsert({
        where: { version: 1 },
        update: { name: "v1", date: new Date(), isActive: true },
        create: { version: 1, name: "v1", date: new Date(), isActive: true },
    });

    // чистим строки этой версии, чтобы seed можно было запускать много раз
    await prisma.priceRow.deleteMany({ where: { versionId: v1.id } });

    const rows = Array.from({ length: 100 }).map((_, i) => {
        const base = rnd(10, 300);
        return {
            versionId: v1.id,
            product_id: `P-${String(i + 1).padStart(4, "0")}`,
            name: `Товар ${i + 1}`,

            rb_buy: base,
            price_rb: base + rnd(1, 50),
            otkat_rb: rnd(0, 20),
            otkat_rb_d: rnd(0, 20),

            delivery_c_br: rnd(0, 30),
            delivery_c_usd: rnd(0, 30),
            delivery_r_br: rnd(0, 30),
            delivery_r_usd: rnd(0, 30),
            price_delivery_br: rnd(0, 30),

            ru_buy: base + rnd(0, 50),
            price_ru: base + rnd(10, 80),
            otkat_ru: rnd(0, 20),
            otkat_ru_d: rnd(0, 20),

            delivery_ru_ru: rnd(0, 30),
            delivery_ru_usd: rnd(0, 30),
            price_delivery_ru: rnd(0, 30),

            koef: rnd(1, 20),
        };
    });

    await prisma.priceRow.createMany({ data: rows });

    console.log("Seed OK:", {
        admin: { email: adminEmail, password: adminPassword },
        dealer: { email: "dealer1@crm.local", password: "dealer1234" },
        price: { version: v1.version, rows: rows.length },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
