# POS System (Next.js + Laravel 11)

## 📌 About the Project

This is a **Point of Sale (POS) System** built using **Next.js 15.1 (Frontend)** and  **Laravel 11 (Backend)** . The project is designed to handle sales, inventory management, and customer transactions efficiently.

🚀 **This project is part of my OJT at Infinitech.**

## 🛠️ Tech Stack

* **Frontend:** Next.js 15.1, TypeScript, Tailwind CSS, ShadCN UI
* **Backend:** Laravel 11, Laravel Passport for authentication
* **Database:** MySQL
* **State Management:** Zustand
* **API Requests:** Axios

## 🎯 Features

### **Core Functionalities**

✅ **Sales & Checkout**

* Scan or manually enter product details
* Barcode and QR code scanning support
* Apply discounts, coupons, or promos
* Multi-payment options (Cash, Credit Card, Digital Wallets)
* Generate sales receipts (print & email)

✅ **Inventory Management**

* Add, update, and delete product details
* Stock level tracking with low-stock alerts
* Automatic stock deduction after a sale
* Bulk import/export of product lists
* Categorization & tagging of products
* Supplier tracking for stock replenishment

✅ **Customer Management**

* Add and manage customer profiles
* Track purchase history for personalized recommendations
* Loyalty points system & rewards program
* Membership and discount eligibility
* Customer feedback & rating system

✅ **Store & User Management**

* Role-based access (Admin, Cashier, Manager)
* Multiple store/branch support
* User activity logs for accountability
* Shift and cash drawer management

✅ **Reports & Analytics**

* Daily, weekly, and monthly sales reports
* Best-selling product reports
* Profit and loss analytics
* Inventory status reports
* Export reports as CSV, Excel, or PDF

✅ **Payment & Invoicing**

* Generate & print invoices
* Integration with third-party payment gateways
* Installment and layaway plan support
* Refund & return management with reason logging

✅ **Additional Features**

* Dark & Light Mode for UI customization
* Customizable Receipt Templates for branding
* Mobile-Friendly Design optimized for tablet POS usage

## 🔧 Installation & Setup

### **Backend (Laravel 11)**

1. Clone the repository:
   ```sh
   git clone https://github.com/Mr-Luam/pos-system.git
   cd pos-system/backend
   ```
2. Install dependencies:
   ```sh
   composer install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
4. Generate application key:
   ```sh
   php artisan key:generate
   ```
5. Run migrations & seed database:
   ```sh
   php artisan migrate --seed
   ```
6. Install Laravel Passport:
   ```sh
   php artisan passport:install
   ```
7. Start the server:
   ```sh
   php artisan serve
   ```

### **Frontend (Next.js 15.1)**

1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env.local
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## 📜 License

This project is for **educational and training purposes** as part of my  **OJT at Infinitech** .

## 👨‍💻 Author

**[Mark Lua]** – OJT at Infinitech

## ⭐ Contributions

⚠️ Disclaimer
This project is still under active development.
Features may change, bugs may appear, and some parts might not be fully optimized yet.

It's also our first serious attempt using Next.js, so the code might not be the cleanest or most idiomatic in places.
We're learning as we go — so feel free to explore, suggest improvements, or contribute after the initial release!

We welcome constructive feedback, ideas, and pull requests — just please be kind 😄
