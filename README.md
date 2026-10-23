# 🛒 KRIXXEEY FreshMart - Grocery Shopping Mobile Application

A modern, full-featured **React Native Grocery Shopping Mobile Application** built with **Expo**, **React Navigation** (Stack, Drawer, and Bottom Tabs), and local state management via React Context API (no external backend/database required).

---

## 🌟 Key Features

### 👤 Customer Experience
- **Interactive Home / Welcome Screen:** Toggle between Customer and Admin portals with one tap.
- **Authentication:** Customer Sign Up and Sign In with instant form validation.
- **Product Catalog (44+ Grocery Items):**
  - High-resolution fresh produce images across Fresh Fruits, Vegetables, Dairy & Eggs, Bakery, and Beverages.
  - Indian Rupee (`₹`) pricing with discount percentages and original strike-through prices.
  - Real-time search by keyword and category filters.
  - Quick filters: `Hot Offers`, `Top Rated (4.8+)`, `100% Organic`, and `Under ₹50`.
  - Sort by Price (Low to High) and Customer Ratings.
- **Side-Scrolling Hot Offers Carousel:** Top discount deals accessible with a horizontal swipe.
- **Product Details Screen:**
  - Full product images with organic badges and delivery dispatch ETA (15 Mins).
  - Nutritional facts breakdown (Calories, Fat, Carbs, Protein) and origin information.
  - Verified customer reviews modal with 5-star rating breakdown.
  - Native product share action.
- **Favourites / Wishlist:** Instant toggle with heart icon; seamless addition to cart directly from favorites.
- **Shopping Cart & Checkout:**
  - Increase, decrease, or remove items with real-time subtotal, delivery fee calculation, and dynamic total.
  - 1-tap coupon promo codes (`FRESH10`, `GROCERY20`, `SUPER25`, `KRIXXEY50`).
  - Interactive 4-step live order tracker with estimated delivery countdown.
- **Customer Profile & Edit Profile:**
  - Update full name, email, phone number, and delivery address.
  - Female avatar selector with 8 curated profiles.
  - Order history and preferences.

### 🛡️ Admin Portal (KRIXXEY)
- **Dedicated Admin Control View:** Clean, focused catalog management screen.
- **+ Add Product Modal:**
  - Add new products with name, price (₹), unit, category, and discount.
  - Curated 17-item preset grocery photo gallery with 1-tap selection + custom photo URL support.
  - Live image preview card with fallback protection.
  - Auto-filter reset and smooth scroll-to-top placing the newly created product immediately at the top of the store.
- **Admin Logout:** Quick return to the Welcome portal.

---

## 🧭 Navigation Architecture (30 Marks)

1. **Stack Navigation:**
   - Welcome → Sign In / Sign Up → Main Tabs → Product Detail.
2. **Bottom Tabs Navigation (Customer):**
   - 🏠 Home / Shop
   - 🛍️ Products Catalog
   - ❤️ Favourites
   - 🛒 My Cart (with dynamic cart count badge)
   - 👤 Profile
3. **Drawer Navigation:**
   - Accessible via side menu button on all primary screens.
   - Quick jumps to Home, Products, Favourites, My Cart, Profile, and Sign Out.

---

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) (v0.88.0)
- **Platform:** [Expo](https://expo.dev/) (SDK 58)
- **Navigation:** [@react-navigation/native](https://reactnavigation.org/)
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/drawer`
  - `react-native-gesture-handler`
  - `react-native-reanimated`
  - `react-native-screens`
  - `react-native-safe-area-context`
- **Icons:** `@expo/vector-icons` (Ionicons)
- **State Management:** React Context API (Local State, zero backend/database dependency)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Git
- Mobile device with **Expo Go** app installed (Android / iOS)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BALAMANIKANDAN020/KRIXXEEY-GROCERY.git
   cd KRIXXEEY-GROCERY
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on Device:
   - Open **Expo Go** on your Android/iOS mobile phone.
   - Scan the QR code displayed in the terminal.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@freshmart.com` | `customer123` |
| **Admin (KRIXXEY)** | `admin@freshmart.com` | `admin123` |

*(You can also use the "Quick Demo Login" button directly on the Welcome screen or sign up with a new account).*

---

## 📄 License
This project is created for educational and college demonstration purposes.
