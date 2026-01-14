/**
 * prisma/seed.js
 *
 * Idempotency notes:
 * - Dictionaries are seeded with upsert (safe to re-run).
 * - Orders/Leads are re-created each run, but BEFORE that we delete previous demo data
 *   (only data created by this seed pattern: ORD-1000.. and demo leads/projects).
 *
 * If you want PERFECT idempotency without deletes:
 * - Make Order.orderNumber @unique
 * - Make Project.name @unique
 * - Replace create() with upsert() for Orders/Projects
 */

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const day0UTC = (d) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

async function ensureProject(name, data) {
    // Project.name is NOT unique in schema -> prevent infinite duplicates
    const existing = await prisma.project.findFirst({ where: { name } });
    if (existing) return existing;
    return prisma.project.create({ data: { name, ...data } });
}

async function main() {
    // =====================================================================
    // (Optional) CLEAN previous demo data so seed can be re-run safely
    // =====================================================================
    // Delete order products -> orders -> leads -> adspend demo window -> projects by name
    // We only remove clearly demo data from this seed.
    const demoOrderNumbers = Array.from({ length: 15 }).map((_, i) => `ORD-${1000 + i}`);
    const demoProjectNames = ["Project Alpha", "Project Beta", "Project Gamma"];

    const demoOrders = await prisma.order.findMany({
        where: { orderNumber: { in: demoOrderNumbers } },
        select: { id: true },
    });
    const demoOrderIds = demoOrders.map((o) => o.id);

    if (demoOrderIds.length) {
        await prisma.orderProduct.deleteMany({ where: { orderId: { in: demoOrderIds } } });
        await prisma.order.deleteMany({ where: { id: { in: demoOrderIds } } });
    }

    await prisma.lead.deleteMany({
        where: { project: { name: { in: demoProjectNames } } },
    });

    // remove only last 30 days adSpend demo window (safe)
    await prisma.adSpend.deleteMany({
        where: { date: { gte: daysAgo(30) } },
    });

    // (Projects are used by Leads, so delete after leads)
    await prisma.project.deleteMany({ where: { name: { in: demoProjectNames } } });

    // =====================================================================
    // ROLES
    // =====================================================================
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

    // =====================================================================
    // USERS
    // =====================================================================
    const adminEmail = "admin@test.com";
    const adminPassword = "NewPass123!";
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { isActive: true, name: "Admin User" },
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

    // =====================================================================
    // DEALER + DEALER USER
    // =====================================================================
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

    // =====================================================================
    // DICTIONARIES: Currency, OrderType, Country, ProductType
    // =====================================================================
    const usd = await prisma.currency.upsert({
        where: { code: "USD" },
        update: { symbol: "$" },
        create: { code: "USD", symbol: "$" },
    });

    const typeOnline = await prisma.orderType.upsert({
        where: { name: "ONLINE" },
        update: {},
        create: { name: "ONLINE" },
    });

    const typeOffline = await prisma.orderType.upsert({
        where: { name: "OFFLINE" },
        update: {},
        create: { name: "OFFLINE" },
    });

    const countryUSA = await prisma.country.upsert({
        where: { name: "USA" },
        update: {},
        create: { name: "USA" },
    });

    const countryCA = await prisma.country.upsert({
        where: { name: "Canada" },
        update: {},
        create: { name: "Canada" },
    });

    const ptKitchen = await prisma.productType.upsert({
        where: { name: "Kitchen" },
        update: {},
        create: { name: "Kitchen" },
    });

    const ptBathroom = await prisma.productType.upsert({
        where: { name: "Bathroom" },
        update: {},
        create: { name: "Bathroom" },
    });

    const ptWindows = await prisma.productType.upsert({
        where: { name: "Windows" },
        update: {},
        create: { name: "Windows" },
    });

    const countries = [countryUSA, countryCA];
    const productTypes = [ptKitchen, ptBathroom, ptWindows];

    // =====================================================================
    // ORDER STATUSES (ORDER / PREORDER / REPEAT / DONE)
    // =====================================================================
    const statusOrder = await prisma.orderStatus.upsert({
        where: { name: "ORDER" },
        update: {},
        create: { name: "ORDER" },
    });

    const statusPreorder = await prisma.orderStatus.upsert({
        where: { name: "PREORDER" },
        update: {},
        create: { name: "PREORDER" },
    });

    const statusRepeat = await prisma.orderStatus.upsert({
        where: { name: "REPEAT" },
        update: {},
        create: { name: "REPEAT" },
    });

    const statusDone = await prisma.orderStatus.upsert({
        where: { name: "DONE" },
        update: {},
        create: { name: "DONE" },
    });

    const statuses = [statusOrder, statusPreorder, statusRepeat, statusDone];

    // =====================================================================
    // PROJECTS (for Leads + demo relations)
    // =====================================================================
    const prj1 = await ensureProject("Project Alpha", {
        domain: "alpha.local",
        url: "https://alpha.local",
        countryId: countryUSA.id,
        productTypeId: ptKitchen.id,
    });

    const prj2 = await ensureProject("Project Beta", {
        domain: "beta.local",
        url: "https://beta.local",
        countryId: countryUSA.id,
        productTypeId: ptWindows.id,
    });

    const prj3 = await ensureProject("Project Gamma", {
        domain: "gamma.local",
        url: "https://gamma.local",
        countryId: countryCA.id,
        productTypeId: ptBathroom.id,
    });

    const projects = [prj1, prj2, prj3];

    // =====================================================================
    // ORDERS + ORDER PRODUCTS
    // =====================================================================
    const createdOrders = [];
    for (let i = 0; i < 15; i++) {
        const country = countries[i % countries.length];
        const productType = productTypes[i % productTypes.length];

        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-${1000 + i}`,
                project: ["Kitchen", "Bathroom", "Windows"][i % 3],

                phones: i % 3 === 0 ? "+1 (555) 100-0000" : null,
                date: daysAgo(30 - i),
                routeDate: i % 2 === 0 ? daysAgo(25 - i) : null,

                total: 100 + i * 20,
                kickback: rnd(0, 20),
                dealerKickback: i % 4 === 0 ? 0 : 10,
                dealerId: i % 2 === 0 ? dealer.id : null,

                statusId: statuses[i % statuses.length].id,
                currencyId: usd.id,
                typeId: i % 2 === 0 ? typeOnline.id : typeOffline.id,
                countryId: country.id,
                productTypeId: productType.id,
            },
        });

        createdOrders.push(order);
    }

    for (let i = 0; i < createdOrders.length; i++) {
        if (i % 2 !== 0) continue;
        await prisma.orderProduct.createMany({
            data: [
                { orderId: createdOrders[i].id, name: "Item A", qty: 1, price: rnd(10, 80) },
                { orderId: createdOrders[i].id, name: "Item B", qty: 2, price: rnd(10, 80) },
            ],
        });
    }

    // =====================================================================
    // LEADS (for dashboard/statistics)
    // =====================================================================
    const leadSources = ["YANDEX", "GOOGLE", "OTHER"];
    await prisma.lead.createMany({
        data: Array.from({ length: 50 }).map((_, i) => {
            const project = projects[i % projects.length];
            const source = leadSources[i % leadSources.length];
            return {
                source,
                createdAt: daysAgo(rnd(0, 30)),
                projectId: project.id,
                countryId: project.countryId,
                productTypeId: project.productTypeId,
            };
        }),
    });

    // =====================================================================
    // AD SPEND (with relations)
    // IMPORTANT: composite unique where name may differ in your client types.
    // If it errors, check node_modules/.prisma/client/index.d.ts -> AdSpendWhereUniqueInput
    // =====================================================================
    const spendRows = [];
    for (let d = 0; d < 7; d++) {
        for (const source of ["YANDEX", "GOOGLE", "OTHER"]) {
            const country = countries[d % countries.length];
            const productType = productTypes[d % productTypes.length];
            spendRows.push({
                date: day0UTC(daysAgo(d)),
                source,
                amount: rnd(10, 200),
                supposed: rnd(10, 220),
                countryId: country.id,
                productTypeId: productType.id,
            });
        }
    }

    for (const r of spendRows) {
        await prisma.adSpend.upsert({
            where: {
                date_source_countryId_productTypeId: {
                    date: r.date,
                    source: r.source,
                    countryId: r.countryId,
                    productTypeId: r.productTypeId,
                },
            },
            update: { amount: r.amount, supposed: r.supposed },
            create: r,
        });
    }

    // =====================================================================
    // PRICE VERSION + ROWS
    // =====================================================================
    const v1 = await prisma.priceVersion.upsert({
        where: { version: 1 },
        update: { name: "v1", date: new Date(), isActive: true },
        create: { version: 1, name: "v1", date: new Date(), isActive: true },
    });

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
        dictionaries: {
            currencies: ["USD"],
            orderTypes: ["ONLINE", "OFFLINE"],
            countries: ["USA", "Canada"],
            productTypes: ["Kitchen", "Bathroom", "Windows"],
            projects: projects.map((p) => p.name),
            statuses: statuses.map((s) => s.name),
        },
        demo: {
            orders: createdOrders.length,
            leads: 50,
            adSpendRows: spendRows.length,
            price: { version: v1.version, rows: rows.length },
        },
    });
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
