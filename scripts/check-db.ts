import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const productsCount = await prisma.product.count();
    const categoriesCount = await prisma.category.count();
    const products = await prisma.product.findMany({
        include: { category: true }
    });

    console.log("--- Rapport de la Base de Données ---");
    console.log(`Nombre de produits: ${productsCount}`);
    console.log(`Nombre de catégories: ${categoriesCount}`);
    console.log("\nListe des produits :");
    products.forEach(p => {
        console.log(`- ${p.name} | Cat: ${p.category?.name || "SANS CATÉGORIE"} | Prix: ${p.price} TND | Actif: ${p.isActive}`);
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
