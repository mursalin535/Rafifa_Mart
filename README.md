<div align="center">

# ✨ Rafifa Mart ✨

### *Where Fragrance Meets Heritage*

**A full-stack luxury perfume & attar e-commerce platform** — built with React, Node.js, Express and MySQL.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Rollbar](https://img.shields.io/badge/Monitoring-Rollbar-E85D4C?style=flat-square&logo=rollbar&logoColor=white)

[![License](https://img.shields.io/badge/license-ISC-C9A864?style=flat-square)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)

<br/>

<img src="Front_end/External_conponents/website_launch_offer.png" alt="Rafifa Mart preview" width="70%"/>

</div>

---

## 📖 Overview

**Rafifa Mart** is a complete e-commerce solution for a Bangladeshi luxury fragrance house, selling two distinct product lines:

| Line | Description |
|------|-------------|
| 🌸 **Perfumes** | Curated fragrances across six scent families — *floral, fresh, amber, woody, gourmand, citrusy* — for **Male** & **Female**, sold in **atar** (oil) and **spray** formats across multiple volumes. |
| 🍾 **Perfume Bottles** | A standalone collection of premium empty/sample bottles, decant sprays and refill pouches — sold piece by piece. |

The platform ships with a **customer storefront**, a **powerful admin back-office**, **OTP + Google authentication**, **time-bound promotional offers**, **review & rating**, and **full order lifecycle management** — all wrapped in a dark-emerald-and-gold heritage aesthetic.

---

## 🎯 Feature Highlights

### 🛍️ Storefront
- **Immersive home page** — animated hero, scent-category browsing, featured collections, offer previews and brand storytelling.
- **Smart collection pages** — filter by scent family, gender, packaging and price; featured carousel + full grid.
- **Rich product details** — image gallery, variant selector (atar/spray × volume), *live offer-aware pricing*, average rating and reviews.
- **Bottle shop** — dedicated listing, filters and single-bottle buy-now flow.
- **Offers & promotions** — banner carousels, expiry-aware discounts (`flat` / `percentage`), auto-applied at checkout.
- **Express checkout** — address book with default-address support, cash-on-delivery, inline new-address form.
- **Customer profile** — order history with expandable line items, live status badges, address management, phone update.
- **Dark / light theme** with scroll-aware sticky navbar and smooth motion design.

### 🔐 Authentication & Security
- **Email + password** signup with **6-digit OTP verification** (60s TTL, emailed via Gmail SMTP).
- **Google OAuth 2.0** with automatic account linking (by `google_id`, then by email).
- **Server-side sessions** persisted in MySQL (`express-mysql-session`), `httpOnly` + `sameSite` cookies.
- **bcrypt** password hashing, **Helmet** headers, env-driven **CORS** allow-list.
- **Role-based access**: `requireAdmin` middleware guards **21 admin endpoints**; separate frontend guards for customer and admin areas.

### 🛠️ Admin Back-Office
| Module | Capabilities |
|--------|--------------|
| **Products** | CRUD, gallery upload with primary-image selection, drag-and-drop images (JPEG/PNG/WebP · 5 MB), statistics bar |
| **Variants** | Per-product packaging (`atar` 3/6/12 ml · `spray` 12–100 ml), price & stock control, unique SKU constraint |
| **Bottles** | Full CRUD with view modal and stock tracking |
| **Offers** | Create/edit/delete, thumbnail upload, assign/remove to products, expiry indicators |
| **Orders** | Search, status filter, revenue & pending stats, expandable details, one-click status transitions (`pending → confirmed → shipped → delivered`) |
| **Customers** | Read-only directory with search and revenue metrics |
| **Admins** | Add admin via OTP, change password, delete (self-delete blocked) |

### 📊 Observability
- **Rollbar** error tracking on **both** client and server.
- HTML **health/status endpoint** (uptime, heap, Node version).
- Structured server logs (`server_out.log` / `server_err.log`).

---

## 🏗️ Architecture

```
Rafia_mart/
├── 📁 Back_end/                 # REST API — Express 5 + MySQL
│   ├── main.js                  # App bootstrap, CORS, helmet, sessions
│   ├── router/                  # 13 routers (auth, products, orders, offers…)
│   ├── controller/              # Business logic
│   ├── model/                   # mysql2 queries
│   ├── DataBase/                # DB pool · session store · Passport config
│   ├── services/email.js        # OTP mail templates
│   ├── requireAdmin.js          # Session-based admin guard
│   └── uploads/                 # Product & offer images (multer)
│
├── 📁 Front_end/                # SPA — React 18 + Vite 7
│   └── src/
│       ├── main.jsx             # Router + Rollbar provider
│       ├── components/
│       │   ├── Home/  Collection/  Offers/  Order/  Profile/
│       │   ├── Auth/            # Login · Signup · ProtectedRoute
│       │   ├── Admin/           # Full back-office suite
│       │   ├── Server/          # 11 typed API wrappers
│       │   └── layout/          # Navbar · Footer · Layout
│       ├── context/             # AuthContext · ThemeContext
│       └── rollbar.js           # Client error reporting
│
└── 📁 Database/
    └── Rafifa_mart_database.sql # Full schema + seed data
```

### Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18 · Vite 7 · React Router v7 · Tailwind CSS 4 · framer-motion · lucide-react · Axios |
| **Backend** | Node.js · Express 5 · mysql2 · express-session · Passport.js · bcrypt · nodemailer · multer · Helmet |
| **Database** | MySQL 8 — 14 tables with foreign keys & cascade rules |
| **Auth** | Session cookies · Email OTP · Google OAuth 2.0 |
| **Monitoring** | Rollbar (client + server) |

---

## 🗄️ Database Schema

```
customers ──┬──< addresses
            ├──< orders ──┬──< order_items  ──< product_variants >── products ──< product_images
            │             │                  └──< order_bottles   ──< bottles
            └──< ratings >── products

offers ──< product_offers >── products
admin_info · sessions
```

| Table | Purpose |
|-------|---------|
| `customers` | Shoppers — bcrypt password (optional for Google-only), `google_id`, account status |
| `addresses` | Multiple delivery addresses per customer, Bangladesh divisions/districts, default flag |
| `products` | Perfume catalogue — scent family + gender |
| `product_variants` | Sellable format: `atar` / `spray`, volume, price, stock |
| `product_images` | Gallery with a single primary image |
| `bottles` | Standalone bottle SKUs — piece-level stock & pricing |
| `orders` | Order header — payment method (`cod`/`online`), 5-state status, address ref |
| `order_items` / `order_bottles` | Perfume and bottle line items (parallel, both cascade on delete) |
| `ratings` | 1–5 star product reviews |
| `offers` / `product_offers` | Time-bound `flat` or `percentage` discounts, M:N to products |
| `admin_info` | Admin accounts |
| `sessions` | MySQL-backed session store |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8
- A **Gmail app password** (for OTP emails)
- *(Optional)* Google OAuth credentials + Rollbar account

### 1 · Clone the repository

```bash
git clone https://github.com/<your-username>/Rafia_mart.git
cd Rafia_mart
```

### 2 · Set up the database

```bash
mysql -u root -p -e "CREATE DATABASE rafifa_mart;"
mysql -u root -p rafifa_mart < Database/Rafifa_mart_database.sql
```

### 3 · Configure the backend

```bash
cd Back_end
npm install
```

Create a `.env` file in `Back_end/`:

```env
NODE_ENV=development
PORT=5007

ROLLBAR_ACCESS_TOKEN=your_rollbar_server_token
ROLLBAR_ENVIRONMENT=development

# MySQL
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=rafifa_mart

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_CREDENTIALS=true

# Sessions
SESSION_SECRET=generate_a_long_random_hex_string

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5007/auth/google/callback

FRONTEND_URL=http://localhost:5173

# Email (Gmail App Password)
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_app_password
```

> 💡 Generate a strong session secret with:
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Then start the API:

```bash
npm start          # nodemon → http://localhost:5007
```

### 4 · Configure the frontend

```bash
cd ../Front_end
npm install
```

Create a `.env` file in `Front_end/`:

```env
VITE_ROLLBAR_CLIENT_TOKEN=your_rollbar_browser_token
VITE_CLARITY_ID=your_microsoft_clarity_id
```

```bash
npm run dev        # → http://localhost:5173
```

### 5 · Create your first admin

Sign up as a customer, then promote an account through the **Admin → Admins** module (OTP-verified), or insert a bcrypt hash directly into `admin_info`.

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Development | `http://localhost:5173` | `http://localhost:5007` |

---

## 📡 API Reference

<details>
<summary><b>Authentication</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register with password |
| POST | `/send-otp` | Email a 6-digit verification code |
| POST | `/verify-otp` | Verify code and create account |
| POST | `/login` | Email + password sign-in |
| POST | `/logout` | Destroy session |
| GET | `/me` | Current session user |
| GET | `/auth/google` | Start Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
</details>

<details>
<summary><b>Products & Variants</b></summary>

| Method | Endpoint | Guard |
|--------|----------|-------|
| GET | `/products` · `/product/:id` | — |
| POST | `/add_product` | admin |
| PUT | `/update_product/:id` | admin |
| DELETE | `/delete_product/:id` | admin |
| GET | `/all_variants` · `/product/:id/variants` | — |
| POST | `/product/:id/variant` | admin |
| PUT | `/update_variant/:id` | admin |
| DELETE | `/delete_variant/:id` | admin |
| POST | `/upload_image/:product_id` | admin |
| GET | `/product_images/:id` · `/all_product_images` | — |
| PUT | `/set_primary_image/:id` | admin |
| DELETE | `/delete_image/:id` | admin |
</details>

<details>
<summary><b>Bottles · Offers · Ratings</b></summary>

| Method | Endpoint | Guard |
|--------|----------|-------|
| GET | `/bottles` | — |
| POST/PUT/DELETE | `/bottle*` | admin |
| GET | `/offers` · `/offers_with_products` · `/products_by_offer/:id` | — |
| POST/PUT/DELETE | `/add_offer` · `/update_offer/:id` · `/delete_offer/:id` | admin |
| POST | `/upload_offer_thumbnail` | admin |
| POST | `/assign_offer` · DELETE `/remove_offer/:pid/:oid` | admin |
| POST | `/add_rating` | — |
| GET | `/ratings/:product_id` | — |
| GET | `/all_ratings` · DELETE `/delete_rating/:id` | admin |
</details>

<details>
<summary><b>Orders · Customers · Addresses · Admin</b></summary>

| Method | Endpoint | Guard |
|--------|----------|-------|
| POST | `/add_order` · `/add_bottle_order` | — |
| GET | `/orders` | admin |
| GET | `/orders/customer/:id` · `/order/:id` | — |
| PUT | `/update_order_status/:id` | admin |
| GET | `/customers` | admin |
| GET | `/customer/:id` · `/email/:email` · `/google/:gid` | — |
| POST | `/customer/create` · `/customer/create/google` | — |
| POST | `/add_address` · GET `/addresses/:cid` · PUT `/update_address/:id` | — |
| PUT | `/set_default_address/:cid/:aid` | — |
| DELETE | `/delete_address/:id` · `/delete_addresses/:cid` | — |
| POST | `/admin/login` · `/admin/logout` | — / admin |
| GET | `/admin/me` · `/admin/all` | — / admin |
| POST | `/admin/send-otp` · `/admin/verify-otp` | admin |
| PUT | `/admin/change-password` | admin |
| DELETE | `/admin/:id` | admin |
</details>

---

## 🗺️ Roadmap

- [ ] 🛒 Persistent shopping **cart** (localStorage + server sync)
- [ ] 💳 Online **payment gateway** (bKash / SSLCommerz)
- [ ] ⭐ Server-persisted **reviews** via `POST /add_rating`
- [ ] 🔒 Server-side ownership checks on customer routes (`requireAuth`)
- [ ] 📈 Admin **analytics charts** (revenue, top products)
- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🌏 Multi-language (বাংলা / English)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place!

1. **Fork** the repository
2. Create your feature branch → `git checkout -b feature/amazing-feature`
3. **Commit** your changes → `git commit -m "Add amazing feature"`
4. **Push** to the branch → `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

<div align="center">

**Made with 💛 for fragrance lovers**

*Rafifa Mart — Heritage in every drop.*

</div>
