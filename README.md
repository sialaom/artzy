# Artzy - E-commerce de Cadeaux Personnalisés en Tunisie

Application e-commerce complète pour articles cadeaux personnalisés en Tunisie, construite avec Next.js 14, Stripe, et Prisma.

🔗 **Dépôt GitHub** : [github.com/sialaom/artzy](https://github.com/sialaom/artzy)

## 🚀 Fonctionnalités

### Frontend Client
- ✅ Page d'accueil avec hero section et produits populaires
- ✅ Catalogue produits avec filtres (catégorie, prix, recherche)
- ✅ Détails produit avec personnalisation
- ✅ Panier d'achat avec gestion des quantités
- ✅ Checkout en 3 étapes (Info → Livraison → Paiement)
- ✅ Compte utilisateur avec historique des commandes
- ✅ Authentification complète (inscription, connexion, récupération mot de passe)

### Système de Paiement
- ✅ Intégration Stripe configurée pour Dinar Tunisien (TND)
- ✅ Paiements sécurisés via Stripe
- ✅ Webhooks pour la gestion des paiements

### Backoffice Admin
- ✅ Dashboard avec statistiques (CA, commandes, produits, utilisateurs)
- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion des commandes (changement de statut, suivi)
- ✅ Gestion des utilisateurs
- ✅ Interface sécurisée avec authentification admin

### Fonctionnalités Spéciales
- ✅ Personnalisation de produits (texte, couleur, image)
- ✅ Aperçu en temps réel de la personnalisation
- ✅ Option emballage cadeau (+5 TND)
- ✅ Adaptation tunisienne (gouvernorats, téléphone, prix en TND)

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: API Routes Next.js + Prisma ORM
- **Base de données**: PostgreSQL
- **Paiement**: Stripe
- **Stockage images**: Cloudinary (configuré)
- **Email**: Resend (configuré)
- **Authentification**: NextAuth.js

## 📦 Installation

1. **Cloner le projet**
```bash
cd artzy
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Remplir les variables dans `.env`:
- `DATABASE_URL`: URL de votre base de données PostgreSQL
- `NEXTAUTH_SECRET`: Clé secrète pour NextAuth
- `STRIPE_SECRET_KEY`: Clé secrète Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Clé publique Stripe
- `STRIPE_WEBHOOK_SECRET`: Secret webhook Stripe
- `CLOUDINARY_*`: Credentials Cloudinary
- `RESEND_API_KEY`: Clé API Resend

4. **Configurer la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Créer un utilisateur admin**
Vous pouvez créer un utilisateur admin directement dans la base de données ou via une migration.

6. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
artzy/
├── app/
│   ├── admin/          # Backoffice admin
│   ├── api/            # API Routes
│   ├── auth/           # Pages d'authentification
│   ├── products/       # Pages produits
│   ├── cart/           # Page panier
│   ├── checkout/       # Page checkout
│   └── account/        # Pages compte utilisateur
├── components/         # Composants React
├── contexts/           # Contextes React (Cart)
├── lib/                # Utilitaires et configurations
├── prisma/             # Schéma Prisma
└── types/              # Types TypeScript
```

## 🔐 Authentification Admin

Pour accéder au backoffice admin:
1. Créer un utilisateur avec le rôle `ADMIN` dans la base de données
2. Se connecter avec cet utilisateur
3. Accéder à `/admin`

## 💳 Configuration Stripe

1. Créer un compte Stripe
2. Activer le mode test
3. Configurer la devise TND (Dinar Tunisien) dans Stripe
4. Récupérer les clés API et les ajouter dans `.env`
5. Configurer les webhooks pour `/api/webhooks/stripe`

## 📝 Notes

- Les images produits doivent être uploadées sur Cloudinary
- Les emails sont configurés avec Resend (simulé en développement)
- Le système de personnalisation permet d'ajouter du texte, choisir des couleurs, et uploader des images
- Les frais de livraison sont calculés selon le gouvernorat tunisien

## 🚧 Prochaines Étapes

- [ ] Implémenter la récupération de mot de passe
- [ ] Ajouter la génération de cartes cadeaux
- [ ] Implémenter la génération de factures PDF
- [ ] Ajouter les favoris utilisateur
- [ ] Améliorer l'interface de personnalisation
- [ ] Ajouter des tests

## 📄 Licence

MIT
