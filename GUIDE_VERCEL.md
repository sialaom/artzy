# Guide : Configurer les variables d'environnement Vercel

Suivez ces étapes **dans l'ordre**.

---

## Étape 1 : Créer la base de données (Neon - gratuit)

1. Allez sur **https://console.neon.tech**
2. Cliquez sur **"Sign up"** (ou "Log in" si vous avez déjà un compte)
3. Connectez-vous avec **GitHub** (plus rapide)
4. Après connexion, cliquez sur **"New Project"**
5. Donnez un nom : `artzy`
6. Région : choisissez la plus proche (ex: `Europe (Frankfurt)`)
7. Cliquez sur **"Create Project"**
8. Une fois créé, vous verrez une **Connection string** qui ressemble à :
   ```
   postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
9. **Copiez cette URL** (bouton "Copy" à côté)

---

## Étape 2 : Obtenir l'URL de votre site Vercel

1. Allez sur **https://vercel.com/dashboard**
2. Ouvrez votre projet **artzy**
3. Cliquez sur **"Settings"** (onglet en haut)
4. Notez l'URL de déploiement : `https://artzy-xxx.vercel.app` (ou le nom que vous avez choisi)
5. Si vous n'avez pas encore déployé : faites un déploiement, l'URL apparaîtra après

---

## Étape 3 : Générer NEXTAUTH_SECRET

**Option A** – En ligne : https://generate-secret.vercel.app/32

**Option B** – Dans le terminal (Git Bash) :
```bash
openssl rand -base64 32
```

**Option C** – Utilisez n'importe quelle chaîne aléatoire d'au moins 32 caractères (ex: `artzy-prod-secret-2024-xyz123abc`)

---

## Étape 4 : Ajouter les variables dans Vercel

1. Dans Vercel, ouvrez votre projet **artzy**
2. Cliquez sur **"Settings"** (en haut)
3. Dans le menu de gauche, cliquez sur **"Environment Variables"**
4. Ajoutez **ces 3 variables** (une par une) :

| Nom | Valeur | Environnement |
|-----|--------|---------------|
| `DATABASE_URL` | Collez l'URL Neon (étape 1) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://VOTRE-URL.vercel.app` (ex: https://artzy-xxx.vercel.app) | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Collez la clé générée (étape 3) | Production, Preview, Development |

5. Pour chaque variable : sélectionnez **Production**, **Preview** et **Development**
6. Cliquez sur **"Save"** pour chaque variable

---

## Étape 5 : Créer les tables dans la base de données

1. Sur votre PC, ouvrez un terminal dans le dossier du projet :
   ```bash
   cd c:\tmp\cursor_workspace\artzy
   ```

2. Créez un fichier `.env` local avec votre DATABASE_URL Neon :
   ```
   DATABASE_URL="postgresql://votre-url-neon-ici"
   ```

3. **Important** : utilisez les scripts npm (pas `npx prisma` seul, qui peut installer Prisma 7) :
   ```bash
   npm install
   npm run db:generate
   npm run db:push
   ```

4. Cela crée toutes les tables dans votre base Neon.

---

## Étape 6 : Redéployer sur Vercel

1. Dans Vercel, allez dans l'onglet **"Deployments"**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Ou : faites un nouveau push sur GitHub pour déclencher un déploiement automatique

---

## ✅ Vérification

Votre site devrait fonctionner à :
**https://votre-projet.vercel.app**

- Page d'accueil : OK
- Catalogues produits : Liste vide au début (normal)
- Inscription/Connexion : OK
- Pour ajouter des produits : connectez-vous en admin (voir README pour créer un admin)

---

## ⚠️ En cas d'erreur

- **"Database connection failed"** : Vérifiez que DATABASE_URL est correct et que vous avez bien exécuté `npx prisma db push`
- **"NEXTAUTH_URL mismatch"** : L'URL doit correspondre exactement à celle de Vercel (avec https://)
- **Page blanche** : Consultez les logs dans Vercel → Deployments → cliquez sur le déploiement → "Functions" ou "Build Logs"
