import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Démarrage de l'importation des produits Artzy...");

    // 1. Création des catégories
    const categories = [
        { name: "Bijoux & Accessoires" },
        { name: "Décoration d'Intérieur" },
        { name: "Cadeaux Personnalisés" },
        { name: "Art & Tableaux" },
        { name: "Cadeaux d'Entreprise" },
    ];

    for (const cat of categories) {
        await (prisma as any).category.upsert({
            where: { name: cat.name },
            update: {},
            create: { name: cat.name },
        });
    }

    const allCats = await (prisma as any).category.findMany();
    const getCatId = (name: string) => allCats.find((c: any) => c.name === name)?.id || "";

    // 2. Définition des produits
    const products = [
        {
            name: "Collier Artisanat en Argent",
            description: "Un splendide collier en argent massif, entièrement travaillé à la main par nos artisans tunisiens. Un mélange parfait de tradition et de modernité.",
            price: 145.0,
            categoryId: getCatId("Bijoux & Accessoires"),
            images: ["https://picsum.photos/seed/jewelry1/800/800"],
            stock: 10,
            isCustomizable: true,
        },
        {
            name: "Tableau Calligraphie Arabe Moderne",
            description: "Une œuvre d'art unique mêlant la beauté de la calligraphie arabe traditionnelle à un style abstrait contemporain. Parfait pour sublimer votre salon.",
            price: 280.0,
            categoryId: getCatId("Art & Tableaux"),
            images: ["https://picsum.photos/seed/art1/800/800"],
            stock: 5,
            isCustomizable: false,
        },
        {
            name: "Coffret Cadeau 'Luxury Tunisian'",
            description: "Un coffret élégant comprenant une sélection de produits artisanaux raffinés : bougies parfumées, coupelles en céramique dorée et accessoires en cuir.",
            price: 195.0,
            categoryId: getCatId("Cadeaux d'Entreprise"),
            images: ["https://picsum.photos/seed/box1/800/800"],
            stock: 50,
            isCustomizable: true,
        },
        {
            name: "Céramique de Nabeul - Collection Azur",
            description: "Plat de présentation en céramique peint à la main dans les ateliers de Nabeul. Motifs inspirés de la Méditerranée.",
            price: 65.0,
            categoryId: getCatId("Décoration d'Intérieur"),
            images: ["https://picsum.photos/seed/ceramics1/800/800"],
            stock: 25,
            isCustomizable: false,
        },
        {
            name: "Mug Personnalisé avec Initiale en Or",
            description: "Mug en porcelaine fine avec une lettrine personnalisée dorée à l'or fin. Le cadeau idéal pour une attention particulière.",
            price: 45.0,
            categoryId: getCatId("Cadeaux Personnalisés"),
            images: ["https://picsum.photos/seed/mug1/800/800"],
            stock: 100,
            isCustomizable: true,
        },
    ];

    // 3. Insertion des produits
    for (const product of products) {
        await (prisma as any).product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                categoryId: product.categoryId,
                images: product.images,
                stock: product.stock,
                isCustomizable: product.isCustomizable,
            }
        });
    }

    console.log("Importation terminée avec succès !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
