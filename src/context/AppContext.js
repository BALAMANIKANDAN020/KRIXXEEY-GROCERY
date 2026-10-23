import React, { createContext, useContext, useState } from 'react';
import { initialProducts, avatarList } from '../data/productsData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User Profile State (Supports both 'Customer' and 'Admin')
  const [user, setUser] = useState({
    name: 'Jeevika Bala',
    email: 'jeevika.bala@example.com',
    phone: '+91 63808 62491',
    address: 'No. 24, Gandhi Road, R.S. Puram, Coimbatore - 641002',
    memberSince: 'October 2024',
    role: 'Customer', // 'Customer' or 'Admin'
    avatar: avatarList[0],
  });

  // Start with false so Welcome / Sign In displays first on launch
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Products Data (Stateful so Admin can add new products!)
  const [products, setProducts] = useState(initialProducts);

  // Favourites State
  const [favourites, setFavourites] = useState([
    initialProducts[0],
    initialProducts[5],
  ]);

  // Cart State (Pre-populated sample items in INR)
  const [cart, setCart] = useState([
    { product: initialProducts[0], quantity: 2 },
    { product: initialProducts[3], quantity: 1 },
  ]);

  // Orders History State
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8821',
      date: '22 Oct 2026, 04:30 PM',
      itemsCount: 3,
      total: 398,
      status: 'Delivered',
      deliveryAddress: 'No. 24, Gandhi Road, R.S. Puram, Coimbatore',
      items: ['Fresh Organic Avocados x2', 'Farm Pure Cow Milk x1'],
    },
    {
      id: 'ORD-7619',
      date: '19 Oct 2026, 11:15 AM',
      itemsCount: 2,
      total: 235,
      status: 'Delivered',
      deliveryAddress: 'No. 24, Gandhi Road, R.S. Puram, Coimbatore',
      items: ['Red Crispy Gala Apples x1', 'Artisan Sourdough Loaf x1'],
    },
  ]);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('FRESH10');
  const [discountPercent, setDiscountPercent] = useState(10);

  // Authentication Handlers (Both Admin and Customer)
  const signIn = (email, password, role = 'Customer') => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const cleanRole = role === 'Admin' ? 'Admin' : 'Customer';
    const displayName = cleanRole === 'Admin' 
      ? 'KRIXXEY' 
      : (email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()));

    setUser(prev => ({
      ...prev,
      email: email.trim(),
      name: displayName,
      role: cleanRole,
      avatar: cleanRole === 'Admin' ? avatarList[1] : (prev.avatar || avatarList[0]),
    }));
    setIsAuthenticated(true);
    return { success: true, message: `Signed in successfully as ${cleanRole}!` };
  };

  const signUp = (name, email, password, role = 'Customer') => {
    if (!name || name.trim() === '') {
      return { success: false, message: 'Name cannot be empty.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const cleanRole = role === 'Admin' ? 'Admin' : 'Customer';
    const finalName = cleanRole === 'Admin' && (!name || name.trim() === 'Admin') ? 'KRIXXEY' : name.trim();

    setUser({
      name: finalName,
      email: email.trim(),
      phone: '+91 63808 62491',
      address: 'No. 24, Gandhi Road, R.S. Puram, Coimbatore - 641002',
      memberSince: 'October 2026',
      role: cleanRole,
      avatar: cleanRole === 'Admin' ? avatarList[1] : avatarList[0],
    });
    setIsAuthenticated(true);
    return { success: true, message: `${cleanRole} registration successful! Welcome.` };
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    if (!updatedData.name || updatedData.name.trim() === '') {
      return { success: false, message: 'Name is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedData.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!updatedData.phone || updatedData.phone.trim().length < 8) {
      return { success: false, message: 'Please enter a valid phone number.' };
    }
    if (!updatedData.address || updatedData.address.trim() === '') {
      return { success: false, message: 'Address is required for delivery.' };
    }

    setUser(prev => ({
      ...prev,
      ...updatedData,
    }));
    return { success: true, message: 'Profile updated successfully!' };
  };

  const updateAvatar = (newAvatarUrl) => {
    setUser(prev => ({
      ...prev,
      avatar: newAvatarUrl,
    }));
    return { success: true, message: 'Profile picture updated!' };
  };

  // Admin Feature: Add New Product to Store
  const addNewProduct = (productData) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: productData.name,
      category: productData.category || 'vegetables',
      price: Number(productData.price) || 50,
      originalPrice: Number(productData.price) ? Number(productData.price) + 20 : 70,
      discount: '15% OFF',
      rating: 4.8,
      reviewsCount: 1,
      unit: productData.unit || '1 kg',
      origin: productData.origin || 'Tamil Nadu Farm',
      image: productData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      description: productData.description || 'Freshly added farm grocery product.',
      isFresh: true,
      inStock: true,
    };
    setProducts(prev => [newProduct, ...prev]);
    return { success: true, message: 'New grocery product added to catalog successfully!' };
  };

  // Favourites Handlers
  const isFavourite = (productId) => {
    return favourites.some(item => item.id === productId);
  };

  const toggleFavourite = (product) => {
    setFavourites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFavourite = (productId) => {
    setFavourites(prev => prev.filter(item => item.id !== productId));
  };

  // Cart Handlers
  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, quantity);
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + qtyToAdd,
        };
        return newCart;
      } else {
        return [...prevCart, { product, quantity: qtyToAdd }];
      }
    });
  };

  const increaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.product.id === productId);
      if (!item) return prevCart;

      if (item.quantity <= 1) {
        return prevCart.filter(i => i.product.id !== productId);
      }

      return prevCart.map(i =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = () => {
    if (cart.length === 0) return null;
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      itemsCount: getCartCount(),
      total: Math.round(getCartTotal()),
      status: 'Packing (Arriving in 15 mins)',
      deliveryAddress: user.address,
      items: cart.map(item => `${item.product.name} x${item.quantity}`),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FRESH10') {
      setPromoCode('FRESH10');
      setDiscountPercent(10);
      return { success: true, message: '🎉 10% Fresh discount applied successfully!' };
    } else if (cleanCode === 'GROCERY20') {
      setPromoCode('GROCERY20');
      setDiscountPercent(20);
      return { success: true, message: '🎉 20% Grocery savings applied!' };
    } else if (cleanCode === 'SUPER25') {
      setPromoCode('SUPER25');
      setDiscountPercent(25);
      return { success: true, message: '🎉 25% Super discount applied!' };
    } else if (cleanCode === 'KRIXXEY50' || cleanCode === 'KRIXXEY') {
      setPromoCode('KRIXXEY50');
      setDiscountPercent(30);
      return { success: true, message: '👑 KRIXXEY VIP 30% Mega discount applied!' };
    } else {
      return { success: false, message: 'Invalid coupon. Tap any code below to apply!' };
    }
  };

  // Calculations in INR (₹)
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    return (subtotal * discountPercent) / 100;
  };

  const getDeliveryFee = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 299 ? 0 : 30; // Free delivery over ₹299
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee();
    return Math.max(0, subtotal - discount + delivery);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateAvatar,
        products,
        addNewProduct,
        favourites,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        orders,
        promoCode,
        discountPercent,
        applyPromo,
        getCartCount,
        getCartSubtotal,
        getDiscountAmount,
        getDeliveryFee,
        getCartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
