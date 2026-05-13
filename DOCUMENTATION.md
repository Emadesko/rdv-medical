# 🏥 RDV Médical — Système de Prise de Rendez-vous Médical avec Paiement

Plateforme de prise de rendez-vous médicaux avec validation par le médecin et confirmation par paiement Mobile Money via **Bictorys**.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancer l'application](#-lancer-lapplication)
- [Comptes de test](#-comptes-de-test)
- [Workflow principal](#-workflow-principal)
- [Architecture](#-architecture)

---

## ✨ Fonctionnalités

### 👤 Espace Patient (PWA)
- **Prise de rendez-vous en 5 étapes** : Spécialité → Médecin → Service → Créneau → Motif
- **Calendrier interactif** : affiche uniquement les créneaux disponibles du médecin sélectionné
- **Tableau de bord** : suivi en temps réel de l'état de chaque demande
- **Paiement Mobile Money** via Bictorys (Orange Money, Wave, Free Money…)
- **Gestion des liens de paiement** : régénération si le lien de 10 min expire (délai total de 30 min)
- **Notifications email** à chaque étape clé

### 👨‍⚕️ Espace Médecin
- **Agenda hebdomadaire** : vue semaine avec créneaux colorés par statut
- **Génération de créneaux** : sélection date + plage horaire + durée → génération automatique
- **Gestion des demandes** : liste des RDV en attente avec actions Valider / Rejeter
- **Gestion des consultations** : filtres par statut, date, recherche par nom/téléphone
- **Actions par statut** : Consultation effectuée / Patient absent / Annuler
- **Notes médicales** privées par consultation

### ⚙️ Système
- **Authentification JWT** avec access token (15 min) + refresh token (7 jours) en cookies HTTP-only
- **Guards par rôle** : PATIENT / MEDECIN / ADMIN
- **Emails automatiques** : confirmation demande, lien paiement, confirmation paiement, rejet, rappel J-1
- **Cron jobs** : expiration paiement (30 min), rejet auto créneaux passés, rappels quotidiens à 15h
- **Redis** : stockage temporaire des liens de paiement (TTL 10 min) + timers (TTL 30 min)

---

## 🛠 Stack technique

### Backend
| Technologie | Usage |
|---|---|
| **NestJS** | Framework backend |
| **PostgreSQL** | Base de données principale |
| **TypeORM** | ORM |
| **Redis (ioredis)** | Cache / liens de paiement temporaires |
| **JWT** | Authentification |
| **@nestjs-modules/mailer** | Envoi d'emails |
| **Bictorys API** | Paiement Mobile Money |
| **@nestjs/schedule** | Cron jobs |
| **class-validator** | Validation des DTOs |

### Frontend
| Technologie | Usage |
|---|---|
| **Angular 17+** | Framework frontend |
| **PWA** | Application installable |
| **Tailwind CSS** | Styles |
| **Reactive Forms** | Formulaires |
| **HttpClient + Interceptors** | Requêtes HTTP |
| **Route Guards** | Protection des routes par rôle |

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** (recommandé pour PostgreSQL et Redis)
- **Angular CLI** >= 17.x : `npm install -g @angular/cli`
- Un compte **Bictorys** en mode TEST : [bictorys.com](https://bictorys.com)
- Un compte **Gmail** (ou autre SMTP) pour les emails

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/emadesko/rdv-medical.git
git clone https://github.com/emadesko/rdv-medical-front.git
cd rdv-medical
```

### 2. Lancer PostgreSQL et Redis avec Docker

```bash
docker run -d \
  --name rdv-postgres \
  -e POSTGRES_USER=edem \
  -e POSTGRES_PASSWORD=passer \
  -e POSTGRES_DB=medical_rdv \
  -p 5433:5432 \
  postgres:15

docker run -d \
  --name rdv-redis \
  -p 6379:6379 \
  redis:7
```

### 3. Installer les dépendances backend

```bash
cd rdv-medical
npm install
```

### 4. Installer les dépendances frontend

```bash
cd rdv-medical-front
npm install
```

---

## ⚙️ Configuration

### Backend — `.env`

Copiez le fichier exemple et remplissez les valeurs :

```bash
cp .env.example .env
```

```env
# ========================
# DATABASE
# ========================
DB_HOST=localhost
POSTGRES_USER=edem                      # Nom d'utilisateur PostgreSQL
POSTGRES_PASSWORD=passer                # Mot de passe PostgreSQL
POSTGRES_DB=medical_rdv                 # Nom de la base de données
POSTGRES_PORT=5433                      # Port PostgreSQL (5433 si Docker sur 5432 local)

# ========================
# REDIS
# ========================
REDIS_HOST=localhost                    # Hôte Redis
REDIS_PORT=6379                         # Port Redis

# ========================
# APP
# ========================
APP_PORT=3000                           # Port du serveur NestJS
NODE_ENV=development                    # development | production
FRONTEND_URL=http://localhost:4200      # URL du frontend Angular

# ========================
# JWT ACCESS TOKEN
# ========================
JWT_SECRET=                             # Secret JWT access — chaîne aléatoire longue (min 64 chars)
                                        # Générer avec : openssl rand -base64 64
JWT_EXPIRES_IN=15m                      # Durée de validité : 15m, 1h, etc.

# ========================
# JWT REFRESH TOKEN
# ========================
JWT_REFRESH_SECRET=                     # Secret JWT refresh — DIFFÉRENT du JWT_SECRET
JWT_REFRESH_EXPIRES_IN=7d               # Durée de validité : 7d, 30d, etc.

# ========================
# COOKIE CONFIG
# ========================
ACCESS_TOKEN_COOKIE_NAME=access_token   # Nom du cookie access token
REFRESH_TOKEN_COOKIE_NAME=refresh_token # Nom du cookie refresh token
ACCESS_TOKEN_MAX_AGE=900000             # Durée cookie access en ms (15 min = 900 000)
REFRESH_TOKEN_MAX_AGE=604800000         # Durée cookie refresh en ms (7 jours = 604 800 000)

# ========================
# MAIL
# ========================
MAIL_HOST=smtp.gmail.com                # Hôte SMTP (Gmail, SendGrid, Mailgun…)
MAIL_PORT=587                           # Port SMTP (587 pour TLS, 465 pour SSL)
MAIL_USER=votre@gmail.com               # Adresse email expéditeur
MAIL_PASSWORD=                          # Mot de passe application Gmail
                                        # → Compte Google → Sécurité → Mots de passe d'application

# ========================
# BICTORYS
# ========================
BICTORYS_API_URL=https://api.test.bictorys.com   # URL API Bictorys (test ou prod)
BICTORYS_API_KEY=                                 # Clé publique Bictorys
                                                  # → Dashboard Bictorys → Developpeurs → Clé publique

# ========================
# PAYMENT
# ========================
PAYMENT_LINK_EXPIRES_IN=600             # Durée de validité du lien de paiement en secondes (10 min)
```

### Obtenir les clés Bictorys

1. Créez un compte sur [bictorys.com](https://bictorys.com)
2. Activez le **mode Sandbox** (toggle en haut à droite)
3. Allez dans **Developpeurs → API Keys**
4. Copiez la **Clé publique** → `BICTORYS_API_KEY`

### Configurer Gmail pour les emails

1. Activez la **validation en deux étapes** sur votre compte Google
2. Allez dans **Compte Google → Sécurité → Mots de passe d'application**
3. Créez un mot de passe pour "Application Mail"
4. Copiez ce mot de passe → `MAIL_PASSWORD`

---

## ▶️ Lancer l'application

### Backend

```bash
cd backend

# Lancer en mode développement
npm run start:dev

# Le serveur démarre sur http://localhost:3000
```

### Seed — Peupler la base de données

> ⚠️ À faire une seule fois après le premier lancement

```bash
cd backend
npm run seed
```

Le seed crée automatiquement :
- **6 spécialités** médicales
- **4 services médicaux** (Consultation générale, Analyse de laboratoire, Urgences médicales, Vaccination)
- **20 patients** aléatoires + 1 compte patient de test
- **10 médecins** aléatoires + 1 compte médecin/admin de test
- Des **créneaux** générés sur 7 jours pour chaque médecin

### Frontend

```bash
cd rdv-medical-front

# Lancer en mode développement
ng serve

# L'application démarre sur http://localhost:4200
```

---

## 👥 Comptes de test

> 🔑 **Mot de passe universel pour tous les comptes : `passer123`**

### Comptes principaux

| Rôle | Email | Mot de passe | Accès |
|---|---|---|---|
| **Patient** | `patient@rdv.com` | `passer123` | Espace patient complet |
| **Médecin / Admin** | `docteur@rdv.com` | `passer123` | Espace médecin complet + admin |

### Autres comptes disponibles

Des médecins et patients supplémentaires sont créés aléatoirement dans la base. Pour les voir :

- **Médecins** : consultez la page de liste des médecins dans l'application — leurs emails sont visibles
- **Patients** : consultez directement la base de données PostgreSQL

Tous ces comptes ont le même mot de passe : **`passer123`**

---

## 🔄 Workflow principal

```
1. Patient s'inscrit / se connecte
   ↓
2. Patient prend un RDV en 5 étapes
   → Statut RDV : EN_ATTENTE
   → Email au patient : "Demande reçue"
   ↓
3. Médecin valide la demande
   → Statut RDV : VALIDE
   → Statut créneau : VALIDE (bloqué pendant 30 min)
   → Lien paiement généré dans Redis (TTL 10 min)
   → Email au patient : "Validé — lien de paiement"
   ↓
4. Patient paie via Bictorys (lien valide 10 min, renouvelable pendant 30 min)
   → Statut RDV : PAYE
   → Statut créneau : RESERVE
   → Email au patient + médecin : "Paiement confirmé"
   ↓
5. J-1 à 15h : Email de rappel automatique au patient
   ↓
6. Jour J : Médecin marque la consultation
   → "Effectuée" → Statut CONFIRME + notes médicales
   → "Absent"    → Statut ABSENT
   → "Annuler"   → Statut ANNULE + email patient
```

### Cas d'expiration

- **Lien paiement expiré (10 min)** : le patient peut en régénérer un nouveau depuis son espace
- **Timer 30 min expiré** : le RDV repasse EN_ATTENTE, le créneau redevient disponible, le médecin peut revalider
- **Créneau passé non validé** : rejet automatique par cron job + email au patient

---

## 🏗 Architecture

```
src/
├── core/                          # Modules partagés
│   ├── modules/
│   │   ├── auth/                  # Authentification JWT
│   │   ├── user/                  # Entité User de base
│   │   └── human/                 # Classe abstraite Human (nom, prénom, avatar…)
│   └── common/                    # DTOs, services génériques, exceptions
│
├── modules/                       # Modules métier
│   ├── patient/                   # Gestion patients
│   ├── docteur/                   # Gestion médecins
│   ├── rdv/                       # Rendez-vous + cron jobs
│   │   └── crons/
│   │       ├── rdv-expiration.cron.ts    # Expiration paiement 30 min
│   │       └── reminder.cron.ts          # Rappels J-1 à 15h
│   ├── creneau/                   # Créneaux horaires
│   ├── specialite/                # Spécialités médicales
│   ├── service-medical/           # Services médicaux
│   ├── service-specialite/        # Liaison Service ↔ Spécialité (avec soft delete)
│   ├── docteur-specialite/        # Liaison Médecin ↔ Spécialité
│   └── paiement/                  # Entité Paiement
│
└── common/                        # Utilitaires partagés
    ├── bictorys/                  # Service API Bictorys
    ├── mail/                      # Service emails
    ├── redis/                     # Service Redis
    └── helpers/                   # DateFormatHelper, etc.
```

### Statuts RDV

| Statut | Description |
|---|---|
| `EN_ATTENTE` | Demande soumise par le patient |
| `VALIDE` | Validé par le médecin, en attente de paiement (30 min) |
| `PAYE` | Payé, en attente de la consultation |
| `CONFIRME` | Consultation effectuée |
| `REJETE` | Refusé par le médecin ou expiré automatiquement |
| `ANNULE` | Annulé (patient ou médecin) |
| `ABSENT` | Patient no-show |

### Statuts Créneau

| Statut | Description |
|---|---|
| `DISPONIBLE` | Ouvert, non réservé |
| `EN_ATTENTE` | Une ou plusieurs demandes en cours de traitement |
| `VALIDE` | Un patient est en train de payer (bloqué 30 min) |
| `RESERVE` | Payé et confirmé |
| `BLOQUE` | Indisponibilité médecin ou créneau passé |

---

## 📧 Emails automatiques

| Événement | Destinataire | Déclencheur |
|---|---|---|
| Demande créée | Patient | `rdv.service.ts → creation()` |
| RDV validé | Patient | `rdv.service.ts → valider()` |
| Paiement confirmé | Patient | `rdv.service.ts → getPaymentLink()` |
| RDV rejeté | Patient | `rdv.service.ts → rejeter()` |
| Créneau expiré auto | Patient | `rdv-expiration.cron.ts → handlePassedCreneaux()` |
| Rappel J-1 | Patient | `reminder.cron.ts → sendDailyReminders()` — tous les jours à 15h |

---

## 🔒 Sécurité

- Mots de passe hashés avec **bcrypt** (salt 10)
- Tokens JWT stockés en **cookies HTTP-only** (inaccessibles depuis JavaScript)
- Guards NestJS par rôle sur toutes les routes sensibles
- Validation des données avec **class-validator** sur tous les DTOs
- CORS configuré pour n'autoriser que l'URL du frontend

---

*Développé avec ❤️ — Stack NestJS + Angular + PostgreSQL + Redis + Bictorys*