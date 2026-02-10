import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Nettoyage de la base de données...");

    // Supprimer toutes les données existantes
    await prisma.orderItem.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    console.log("✅ Base de données nettoyée.");

    // 1. Création des catégories
    const categories = [
        { name: "Tableaux Personnalisés" },
        { name: "Duo Mugs" },
        { name: "Mugs Individuels" },
        { name: "Coffrets Cadeaux" },
        { name: "Lampes LED" },
        { name: "Cadres Photo" },
    ];

    for (const cat of categories) {
        await prisma.category.create({
            data: { name: cat.name },
        });
    }

    const allCats = await prisma.category.findMany();
    const getCatId = (name: string) => allCats.find((c) => c.name === name)?.id || "";

    // 2. Importation des produits RÉELS avec prix exacts
    const realProducts = [
        {
            name: "Tableau \"تفاصيل\" Rond",
            description: "خلّدوا حكايتكم في قطعة خشب تحكي عليكم 🤍 لوح خشب أنيق محفور بدقّة، مزيّن بتصميم بلاكسي أسود بارز (en relief)، ومخصّص بصورتكم الشخصية ليحوّل لحظاتكم إلى ذكرى تدوم. يمكنكم إضافة أغنيتكم المفضّلة مع Spotify Code. المقاس: 25 × 25 سم | الخامة: خشب MDF بسمك 3 مم | بلاكسي أسود en relief | تصميم مخصّص حسب صورتكم | أغنية مرفقة مع Spotify Code | فكرة هدية مثالية لعيد الحب والمناسبات الخاصة",
            price: 35.0,
            originalPrice: 50.0,
            categoryId: getCatId("Tableaux Personnalisés"),
            images: ["https://picsum.photos/seed/tableau-rond/800/800"],
            stock: 50,
            isCustomizable: true,
        },
        {
            name: "Tableau \"تفاصيل\" carré",
            description: "Tableau en bois personnalisé de forme carrée avec design en relief. Immortalisez vos moments précieux avec votre photo personnalisée et un Spotify Code de votre chanson favorite. Gravure précise sur bois MDF avec plexiglas noir en relief. Dimensions: 25 × 25 cm.",
            price: 35.0,
            originalPrice: 50.0,
            categoryId: getCatId("Tableaux Personnalisés"),
            images: ["https://picsum.photos/seed/tableau-carre/800/800"],
            stock: 50,
            isCustomizable: true,
        },
        {
            name: "Duo Mugs Couple – Illustrated Portrait \"Together Forever\"",
            description: "Mugs personnalisés avec vos portraits illustrés dans un style artistique unique. Célébrez votre amour avec ce duo \"Together Forever\" qui immortalise votre histoire. Design romantique et élégant, parfait pour les couples.",
            price: 39.0,
            originalPrice: 48.0,
            categoryId: getCatId("Duo Mugs"),
            images: ["https://picsum.photos/seed/mugs-together/800/800"],
            stock: 30,
            isCustomizable: true,
        },
        {
            name: "Duo Mugs Couple Line Art – دُمت لي شيئا جميلا لا ينتهي",
            description: "Duo de mugs élégants avec design Line Art minimaliste et citation arabe romantique. Un cadeau raffiné pour les couples qui apprécient l'art moderne et les touches culturelles. Style épuré et poétique.",
            price: 32.0,
            originalPrice: 28.0,
            categoryId: getCatId("Duo Mugs"),
            images: ["https://picsum.photos/seed/mugs-lineart2/800/800"],
            stock: 35,
            isCustomizable: true,
        },
        {
            name: "Duo Mugs Puzzle – You Complete Me",
            description: "Deux mugs qui s'assemblent comme un puzzle pour former un message complet. Symbolise parfaitement l'union de deux personnes qui se complètent. Design créatif et romantique, idéal pour les couples.",
            price: 28.0,
            originalPrice: null,
            categoryId: getCatId("Duo Mugs"),
            images: ["https://picsum.photos/seed/mugs-puzzle2/800/800"],
            stock: 40,
            isCustomizable: false,
        },
        {
            name: "Mug Couple Line Art – Minimal & Élégant",
            description: "Mug individuel avec design Line Art minimaliste. Style épuré et moderne, parfait pour ceux qui apprécient l'élégance dans la simplicité. Peut être commandé seul ou en complément d'un duo.",
            price: 19.5,
            originalPrice: 25.0,
            categoryId: getCatId("Mugs Individuels"),
            images: ["https://picsum.photos/seed/mug-minimal/800/800"],
            stock: 50,
            isCustomizable: true,
        },
        {
            name: "Duo Mugs Avec Couvercle & Base Liège \"Disney Princess Style\"",
            description: "حوّلوا صورتكم الحقيقية إلى تصميم مستوحى من عالم أميرات و أمراء Disney ✨ كيسان رومانسية برسمة ناعمة و حالمة. الكيسان يجيوا مع: قاعدة liège طبيعية تحمي الطاولة | غطاء يحافظ على سخونة المشروب | طباعة Sublimation HD بألوان ثابتة و ناعمة. هدية مثالية لعيد الحب، الخطوبة أو الذكرى السنوية.",
            price: 39.0,
            originalPrice: 48.0,
            categoryId: getCatId("Duo Mugs"),
            images: ["https://picsum.photos/seed/mugs-disney2/800/800"],
            stock: 25,
            isCustomizable: true,
        },
        {
            name: "Coffret \"Reasons Why I Love You\"",
            description: "Un coffret romantique rempli de petits cœurs personnalisés avec toutes les raisons pour lesquelles vous aimez cette personne spéciale. Un cadeau touchant et créatif qui exprime vos sentiments de manière unique. Parfait pour la Saint-Valentin ou toute occasion spéciale.",
            price: 25.0,
            originalPrice: null,
            categoryId: getCatId("Coffrets Cadeaux"),
            images: ["https://picsum.photos/seed/coffret-love2/800/800"],
            stock: 40,
            isCustomizable: true,
        },
        {
            name: "Lampe LED \"Amour Éternel\"",
            description: "Lampe LED personnalisée avec gravure romantique. Crée une ambiance chaleureuse et intime dans votre espace. Parfaite comme veilleuse ou décoration de chambre. Design élégant qui met en valeur vos sentiments. Éclairage LED doux et économique.",
            price: 45.0,
            originalPrice: 65.0,
            categoryId: getCatId("Lampes LED"),
            images: ["https://picsum.photos/seed/lampe-amour2/800/800"],
            stock: 20,
            isCustomizable: true,
        },
        {
            name: "Lampe LED \"To the Moon and Back\"",
            description: "Lampe LED avec message romantique iconique \"To the Moon and Back\". Illumine votre amour avec une douce lumière LED. Design moderne et poétique, idéal pour exprimer des sentiments profonds. Parfaite pour une chambre ou un espace intime.",
            price: 45.0,
            originalPrice: 65.0,
            categoryId: getCatId("Lampes LED"),
            images: ["https://picsum.photos/seed/lampe-moon2/800/800"],
            stock: 20,
            isCustomizable: true,
        },
        {
            name: "Cadre Photo Personnalisé en Bois ou Plexi",
            description: "Capturez vos plus beaux moments et transformez-les en un souvenir unique. Disponible en deux tailles (A4: 21x30cm et A3: 30x42cm). Deux matériaux au choix: bois naturel ou plexiglas raffiné. Personnalisation avec une phrase spéciale pour rendre votre cadeau encore plus unique. Idéal pour la Saint-Valentin, anniversaire, mariage ou toute occasion spéciale.",
            price: 39.0,
            originalPrice: null,
            categoryId: getCatId("Cadres Photo"),
            images: ["https://picsum.photos/seed/cadre-photo2/800/800"],
            stock: 30,
            isCustomizable: true,
        },
    ];

    console.log("📦 Importation des produits de artzy.tn...");
    for (const product of realProducts) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log("✨ Terminé ! Vos produits artzy.tn sont maintenant en ligne.");
    console.log(`📊 ${realProducts.length} produits importés avec les prix exacts.`);
    console.log("💰 Promotions actives sur 7 produits !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
