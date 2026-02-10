import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting comprehensive seeding...");

    // 1. Create Categories
    const categoryNames = ["Personnalisé", "Général", "Cartes Cadeaux", "Décoration"];
    const categories = [];
    for (const name of categoryNames) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }
        });
        categories.push(cat);
        console.log(`Category created: ${name}`);
    }

    // 2. Create 10 Products
    const productsData = [
        { name: "Tableau Minimaliste (TEST)", price: 120.0, categoryIdx: 3 },
        { name: "Cadre Photo Gravé (TEST)", price: 45.0, categoryIdx: 0, isCustomizable: true },
        { name: "Vase en Céramique (TEST)", price: 85.0, categoryIdx: 1 },
        { name: "Carte Cadeau Joyeux Anniversaire (TEST)", price: 50.0, categoryIdx: 2 },
        { name: "Mug Personnalisé (TEST)", price: 25.0, categoryIdx: 0, isCustomizable: true },
        { name: "Bougie Parfumée (TEST)", price: 35.0, categoryIdx: 1 },
        { name: "Horloge Design (TEST)", price: 150.0, categoryIdx: 3 },
        { name: "Kit de Peinture DIY (TEST)", price: 65.0, categoryIdx: 1 },
        { name: "Carte Cadeau Noël (TEST)", price: 100.0, categoryIdx: 2 },
        { name: "Coussin Brodé (TEST)", price: 40.0, categoryIdx: 0, isCustomizable: true },
    ];

    const products = [];
    for (let i = 0; i < productsData.length; i++) {
        const p = productsData[i];
        const created = await prisma.product.create({
            data: {
                name: p.name,
                description: `Ceci est une description détaillée pour ${p.name}. Parfait pour tester le rendu de l'application Artzy.`,
                price: p.price,
                categoryId: categories[p.categoryIdx].id,
                stock: 20,
                isActive: true,
                isCustomizable: p.isCustomizable || false,
                images: [`https://picsum.photos/seed/product${i}/800/800`],
            }
        });
        products.push(created);
        console.log(`Product created: ${created.name}`);
    }

    // 3. Create Test User
    const testUserEmail = "user@test.com";
    const hashedPassword = await bcrypt.hash("test1234", 10);
    const user = await prisma.user.upsert({
        where: { email: testUserEmail },
        update: {},
        create: {
            email: testUserEmail,
            password: hashedPassword,
            firstName: "Jean",
            lastName: "Testeur",
            phone: "+21699000000",
            role: "USER"
        }
    });
    console.log(`User created: ${testUserEmail}`);

    // 4. Create Address for User
    const address = await prisma.address.create({
        data: {
            userId: user.id,
            label: "Maison",
            firstName: "Jean",
            lastName: "Testeur",
            phone: "+21699000000",
            governorate: "Tunis",
            city: "La Marsa",
            street: "Avenue Habib Bourguiba",
            postalCode: "2070",
            isDefault: true
        }
    });
    console.log("Address created for user");

    // 5. Create Random Order (2 items)
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 2);
    const subtotal = randomProducts.reduce((acc, p) => acc + p.price, 0);
    const shippingCost = 7.0;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            shippingAddressId: address.id,
            subtotal,
            shippingCost,
            total,
            status: "PENDING",
            items: {
                create: randomProducts.map(p => ({
                    productId: p.id,
                    quantity: 1,
                    price: p.price
                }))
            }
        }
    });
    console.log(`Order created: #${order.id.slice(0, 8)} for ${total} DT`);

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
