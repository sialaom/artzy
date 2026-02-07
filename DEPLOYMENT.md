# Guide de déploiement Artzy

## 🚀 Lancer en local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données (voir ci-dessous)
# 3. Créer le fichier .env (copier .env.example)

# 4. Générer Prisma et pousser le schéma
npx prisma generate
npx prisma db push

# 5. Lancer l'application
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 📦 Pousser sur GitHub

```bash
cd c:\tmp\cursor_workspace\artzy

# Initialiser Git (si pas déjà fait)
git init

# Ajouter le remote
git remote add origin https://github.com/sialaom/artzy.git

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "feat: Application Artzy e-commerce complète"

# Pousser (remplacez main par master si nécessaire)
git push -u origin main
```

Si le dépôt existe déjà et est vide :
```bash
git branch -M main
git push -u origin main
```

---

## ☁️ Héberger sur Vercel (recommandé pour Next.js)

Vercel est gratuit et optimisé pour Next.js. Il se connecte directement à GitHub.

### Étapes :

1. **Créer un compte** sur [vercel.com](https://vercel.com) (connexion avec GitHub)

2. **Importer le projet** :
   - Cliquez sur "Add New Project"
   - Sélectionnez votre dépôt `sialaom/artzy`
   - Vercel détectera automatiquement Next.js

3. **Configurer les variables d'environnement** dans Vercel :
   - `DATABASE_URL` - Base PostgreSQL (voir Neon ci-dessous)
   - `NEXTAUTH_URL` - URL de votre site (ex: https://artzy.vercel.app)
   - `NEXTAUTH_SECRET` - Clé secrète générée
   - `STRIPE_*` - Clés Stripe (pour les paiements)

4. **Déployer** - Vercel déploie automatiquement à chaque push sur GitHub !

### Base de données gratuite (Neon)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez une base de données PostgreSQL
3. Copiez l'URL de connexion dans `DATABASE_URL`
4. Exécutez `npx prisma db push` pour créer les tables

---

## 🔗 Votre dépôt GitHub

https://github.com/sialaom/artzy
