# 🧁 Salwa's Bakery — Digital Menu & Staff Portal

A clean, responsive, high-performance **Digital Menu & Staff Portal** built for Salwa's Bakery. Designed for seamless customer browsing and easy staff menu editing with instant cross-device cloud synchronization.

---

## ✨ Features

- **🍰 Public Digital Menu**:
  - Browse artisanal cakes, cupcakes, cookies, pastries, and custom creations.
  - Real-time search by keywords & item descriptions.
  - Category filtering with live count badges.
  - Live item availability badges (*In Stock* vs. *Sold Out*).
  - Multi-theme support: Light, Dark (*Night Rose*), and Warm Cream (*Warm Honey*).
  - Multi-language support: English, Français, and العربية (with native RTL).

- **🔐 Staff Portal (`#staff-login` / `#dashboard`)**:
  - Secure login with staff credentials.
  - **Menu Item Management**: Add new treats, edit pricing/descriptions/photos, delete items.
  - **1-Click Availability Toggle**: Quickly mark items as *In Stock* or *Sold Out* without deleting.
  - **Category Management**: Add and delete menu categories with custom emoji icons.
  - **Cloud Synchronization**: Automatic sync status indicator with manual refresh.

- **⚡ Real-Time Cloud Sync**:
  - Cloud database is the single authoritative source of truth.
  - Edits made on any device immediately sync to all phones, tablets, and computers upon refresh or automatic background polling.
  - Cache-busting headers (`no-store`) prevent stale cached responses on Vercel CDN.

---

## 🗄️ Setting Up Cloud Database on Vercel

To enable cross-device synchronization across all devices:

1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Navigate to the **Storage** tab.
3. Click **Connect Database** and choose **Neon** (or **Postgres**).
4. Click **Create & Connect**. Vercel will automatically set the `POSTGRES_URL` environment variable.
5. Redeploy your project. The table (`salwa_kv`) will be automatically created on first request!

*(If no database is linked, the app runs gracefully in local storage mode.)*

---

## 🔑 Default Staff Credentials

- **Username**: `salwa`
- **Password**: `amoudi`

*(You can customize these in `data.js` under `STAFF_CREDENTIALS`)*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm start
```
