import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany();
    const catMap: Record<string, string> = {};
    categories.forEach(c => {
        catMap[c.name] = c.id;
    });

    const products = [
        {
            name: "Produit de Test 1 (TEST)",
            description: "Description de test pour le produit 1. Ceci est un échantillon pour vérifier l'affichage.",
            price: 45.500,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art1/800/800"],
            stock: 10,
            isActive: true,
        },
        {
            name: "Cadre Photo Personnalisé (TEST)",
            description: "Un magnifique cadre photo pour vos souvenirs les plus précieux. Produit de test.",
            price: 32.000,
            categoryId: catMap["Personnalisé"],
            images: ["https://picsum.photos/seed/art2/800/800"],
            stock: 5,
            isActive: true,
            isCustomizable: true,
        },
        {
            name: "Coffret Cadeau Premium (TEST)",
            description: "Le cadeau idéal pour toutes les occasions. Contient des articles artisanaux.",
            price: 89.900,
            categoryId: catMap["Emballages Cadeaux"],
            images: ["https://picsum.photos/seed/art3/800/800"],
            stock: 3,
            isActive: true,
        },
        {
            name: "Carte Cadeau Artzy 50DT (TEST)",
            description: "Offrez la liberté de choisir avec notre carte cadeau électronique.",
            price: 50.000,
            categoryId: catMap["Cartes Cadeaux"],
            images: ["https://picsum.photos/seed/art4/800/800"],
            stock: 100,
            isActive: true,
        },
        {
            name: "Vase Artisanal en Céramique (TEST)",
            description: "Fait à la main par des artisans locaux. Pièce unique pour votre décoration.",
            price: 120.000,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art5/800/800"],
            stock: 2,
            isActive: true,
        },
        {
            name: "Tote Bag Illustré (TEST)",
            description: "Sac en coton bio avec une illustration originale. Pratique et écologique.",
            price: 25.000,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art6/800/800"],
            stock: 15,
            isActive: true,
        },
        {
            name: "Carnet de Notes Cuir (TEST)",
            description: "Carnet élégant avec couverture en cuir véritable. Idéal pour vos croquis.",
            price: 65.000,
            categoryId: catMap["Personnalisé"],
            images: ["https://picsum.photos/seed/art7/800/800"],
            stock: 7,
            isActive: true,
            isCustomizable: true,
        },
        {
            name: "Bougie Parfumée Lavande (TEST)",
            description: "Ambiance relaxante avec notre bougie à la lavande naturelle.",
            price: 18.500,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art8/800/800"],
            stock: 20,
            isActive: true,
        },
        {
            name: "Tableau Peinture Abstraite (TEST)",
            description: "Oeuvre originale sur toile. Apportez de la couleur à votre intérieur.",
            price: 250.000,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art9/800/800"],
            stock: 1,
            isActive: true,
        },
        {
            name: "Kit DIY Broderie (TEST)",
            description: "Tout ce dont vous avez besoin pour commencer la broderie à la maison.",
            price: 55.000,
            categoryId: catMap["Général"],
            images: ["https://picsum.photos/seed/art10/800/800"],
            stock: 8,
            isActive: true,
        }
    ];

    console.log("Adding 10 test products...");

    for (const product of products) {
        const created = await prisma.product.create({
            data: product as any
        });
        console.log(`Created product: ${created.name} (ID: ${created.id})`);
    }

    console.log("Successfully added 10 products.");
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
