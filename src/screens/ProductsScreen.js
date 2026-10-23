import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { categories } from '../data/productsData';
import Header from '../components/Header';
import ProductCard, { OfferDealCard } from '../components/ProductCard';

const sampleGroceryImages = [
  { name: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80' },
  { name: 'Veggie Greens', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80' },
  { name: 'Ooty Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80' },
  { name: 'Farm Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80' },
  { name: 'Fresh Broccoli', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80' },
  { name: 'Gala Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80' },
  { name: 'Yellow Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Sweet Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80' },
  { name: 'Pure Cow Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80' },
  { name: 'Paneer / Cheese', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80' },
  { name: 'Bakery Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80' },
  { name: 'Filter Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Tender Coconut', url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800&auto=format&fit=crop&q=80' },
  { name: 'Mushrooms', url: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=80' },
  { name: 'Pomegranate', url: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800&auto=format&fit=crop&q=80' },
  { name: 'Green Chillies', url: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=800&auto=format&fit=crop&q=80' },
  { name: 'Native Toor Dal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
];

export default function ProductsScreen({ navigation }) {
  const { products, user, addNewProduct } = useApp();
  const isAdmin = user?.role === 'Admin';
  const flatListRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price_asc', 'rating'
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'offers', 'top_rated', 'organic', 'under_50'
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  // Admin Add Product Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('1 kg');
  const [newProdCat, setNewProdCat] = useState('vegetables');
  const [newProdDiscount, setNewProdDiscount] = useState('15% OFF');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
  );

  // Filter products by selected category, search text, quick filter, and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesQuick = true;
      if (quickFilter === 'offers') {
        matchesQuick = Boolean(item.discount || item.originalPrice);
      } else if (quickFilter === 'top_rated') {
        matchesQuick = item.rating >= 4.8;
      } else if (quickFilter === 'organic') {
        matchesQuick = Boolean(item.isFresh);
      } else if (quickFilter === 'under_50') {
        matchesQuick = item.price <= 50;
      }

      return matchesCategory && matchesSearch && matchesQuick;
    });

    if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, quickFilter]);

  // Featured Offer / Discount Products for Horizontal Side-Scroll
  const offerProducts = useMemo(() => {
    return products.filter(item => item.discount || item.originalPrice);
  }, [products]);

  const handleVoiceSearch = () => {
    setVoiceSearchActive(true);
    setTimeout(() => {
      setSearchQuery('Organic');
      setVoiceSearchActive(false);
      Alert.alert(
        '🎙️ Voice Search Assistant',
        'Recognized: "Organic Produce" — Filtered farm fresh results for you!'
      );
    }, 900);
  };

  const handleOpenDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (e) {
      if (navigation.openDrawer) {
        navigation.openDrawer();
      }
    }
  };

  const handleCreateProduct = () => {
    if (!newProdName.trim()) {
      Alert.alert('Error', 'Product name is required.');
      return;
    }
    if (!newProdPrice || isNaN(newProdPrice) || Number(newProdPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price in ₹.');
      return;
    }

    const priceNum = Number(newProdPrice);
    const hasDiscount = newProdDiscount.trim().length > 0;
    const originalPriceNum = hasDiscount ? Math.round(priceNum * 1.25) : undefined;
    const finalImage = newProdImage.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';

    addNewProduct({
      name: newProdName.trim(),
      price: priceNum,
      originalPrice: originalPriceNum,
      discount: hasDiscount ? newProdDiscount.trim() : null,
      unit: newProdUnit.trim() || '1 kg',
      category: newProdCat,
      image: finalImage,
      description: `Fresh organic ${newProdName.trim()} sourced directly from local Tamil Nadu farms. Pure quality guaranteed.`,
    });

    // Reset filters and search so newly added product is IMMEDIATELY visible at the very top of catalog!
    setSelectedCategory('all');
    setSearchQuery('');
    setQuickFilter('all');
    setSortBy('default');

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 250);

    Alert.alert(
      '✅ Product Added Successfully!',
      `"${newProdName.trim()}" (₹${priceNum}) has been added to the store catalog with your selected image and is now live at the top of the products screen!`
    );

    setNewProdName('');
    setNewProdPrice('');
    setNewProdUnit('1 kg');
    setAddModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Welcome Greeting & Address */}
      <View style={styles.greetingRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.greetingSub}>
            {isAdmin ? "Logged in as Administrator" : "Delivering to Customer Address"}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons
              name={isAdmin ? "shield-checkmark" : "location-sharp"}
              size={16}
              color={isAdmin ? colors.secondary : colors.primary}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {isAdmin ? "FreshMart Central Store • Inventory" : (user.address ? user.address.split(',')[0] : 'Current Location')}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.drawerShortcut}
          onPress={handleOpenDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={20} color={colors.primaryDark} />
          <Text style={styles.drawerShortcutText}>Side Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Express 15-Minute Flash Delivery Banner */}
      <View style={styles.flashDeliveryCard}>
        <View style={styles.flashLeftCol}>
          <View style={styles.flashTagRow}>
            <View style={styles.flashPulseDot} />
            <Ionicons name="flash" size={13} color="#D97706" />
            <Text style={styles.flashTagText}>
              {isAdmin ? "STORE INVENTORY • CENTRAL DISPATCH" : "⚡ 15-MIN EXPRESS DELIVERY"}
            </Text>
          </View>
          <Text style={styles.flashAddressText}>
            {isAdmin ? "Central Hub • Live Stock Management" : "Directly from Farm to Your Doorstep in Coimbatore"}
          </Text>
        </View>
        <View style={styles.flashEtaBadge}>
          <Text style={styles.flashEtaNumber}>{isAdmin ? "LIVE" : "15"}</Text>
          <Text style={styles.flashEtaUnit}>{isAdmin ? "SYNC" : "MINS"}</Text>
        </View>
      </View>

      {/* Admin Quick Action Banner (For Admin & Customer exam requirement) */}
      {isAdmin && (
        <View style={styles.adminControlCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.adminBadgeRow}>
              <Ionicons name="shield-checkmark" size={14} color="#B45309" />
              <Text style={styles.adminBadgeText}>Admin Mode Active</Text>
            </View>
            <Text style={styles.adminCardTitle}>Store Inventory Management</Text>
            <Text style={styles.adminCardSub}>You can add new products and manage prices in ₹.</Text>
          </View>
          <TouchableOpacity
            style={styles.adminAddBtn}
            onPress={() => setAddModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={18} color={colors.white} />
            <Text style={styles.adminAddBtnText}>+ Add Product</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Promotional Banner with INR Currency */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerTextCol}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>FESTIVE SAVINGS</Text>
          </View>
          <Text style={styles.bannerHeading}>Fresh Daily Groceries</Text>
          <Text style={styles.bannerSub}>Save up to 30% on fresh farm produce today!</Text>
          <View style={styles.deliveryFreePill}>
            <Ionicons name="flash" size={12} color={colors.white} />
            <Text style={styles.deliveryFreeText}>Free Delivery Above ₹299</Text>
          </View>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80' }}
          style={styles.bannerImage}
        />
      </View>

      {/* Special Deals & Offers - Horizontal Side-Scroll View */}
      {offerProducts.length > 0 && (
        <View style={styles.offersSection}>
          <View style={styles.offersHeaderRow}>
            <View style={styles.offersTitleGroup}>
              <Ionicons name="flame" size={20} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Hot Offers & Deals</Text>
            </View>
            <View style={styles.sideScrollBadge}>
              <Ionicons name="swap-horizontal" size={12} color={colors.primaryDark} />
              <Text style={styles.sideScrollBadgeText}>Side Scroll ➔</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScrollContent}
          >
            {offerProducts.map(dealItem => (
              <OfferDealCard key={`deal-${dealItem.id}`} product={dealItem} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category Pills */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isSelected ? colors.white : colors.text}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sorting & Filter Options */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort By:</Text>
        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'default' && styles.sortChipActive]}
          onPress={() => setSortBy('default')}
        >
          <Text style={[styles.sortChipText, sortBy === 'default' && styles.sortChipTextActive]}>
            Featured
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'price_asc' && styles.sortChipActive]}
          onPress={() => setSortBy('price_asc')}
        >
          <Text style={[styles.sortChipText, sortBy === 'price_asc' && styles.sortChipTextActive]}>
            ₹ Price: Low to High
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
            ⭐ Top Rated
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Subtitle */}
      <View style={styles.productsHeaderRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Daily Groceries' : categories.find(c => c.id === selectedCategory)?.name}
        </Text>
        <Text style={styles.itemsCount}>{filteredProducts.length} items found</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header
        title={isAdmin ? "FreshMart Store (Admin)" : "FreshMart Grocery"}
        subtitle={isAdmin ? "Admin & Customer View" : "Daily Organic Store (₹ INR)"}
        showDrawer={true}
        showCart={true}
      />

      {/* Pinned Sticky Search Bar & Quick Filters (Ensures Keyboard NEVER drops while typing!) */}
      <View style={styles.pinnedSearchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 44+ fresh vegetables, fruits, milk, eggs..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={handleVoiceSearch}
            style={styles.voiceMicBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name={voiceSearchActive ? "radio" : "mic-outline"}
              size={18}
              color={voiceSearchActive ? colors.danger : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Filter Pills Row (Hot Deals, Top Rated, Organic, Budget) */}
        <View style={styles.quickFilterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilterScroll}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={[styles.quickChip, quickFilter === 'all' && styles.quickChipActive]}
              onPress={() => setQuickFilter('all')}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickChipText, quickFilter === 'all' && styles.quickChipTextActive]}>
                All 44+ Items
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickChip, quickFilter === 'offers' && styles.quickChipActive]}
              onPress={() => setQuickFilter('offers')}
              activeOpacity={0.8}
            >
              <Ionicons name="flame" size={13} color={quickFilter === 'offers' ? colors.white : colors.secondary} />
              <Text style={[styles.quickChipText, quickFilter === 'offers' && styles.quickChipTextActive]}>
                🔥 Hot Deals
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickChip, quickFilter === 'top_rated' && styles.quickChipActive]}
              onPress={() => setQuickFilter('top_rated')}
              activeOpacity={0.8}
            >
              <Ionicons name="star" size={13} color={quickFilter === 'top_rated' ? colors.white : colors.secondary} />
              <Text style={[styles.quickChipText, quickFilter === 'top_rated' && styles.quickChipTextActive]}>
                ⭐ 4.8+ Rated
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickChip, quickFilter === 'organic' && styles.quickChipActive]}
              onPress={() => setQuickFilter('organic')}
              activeOpacity={0.8}
            >
              <Ionicons name="leaf" size={13} color={quickFilter === 'organic' ? colors.white : colors.primaryDark} />
              <Text style={[styles.quickChipText, quickFilter === 'organic' && styles.quickChipTextActive]}>
                🌿 100% Organic
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickChip, quickFilter === 'under_50' && styles.quickChipActive]}
              onPress={() => setQuickFilter('under_50')}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickChipText, quickFilter === 'under_50' && styles.quickChipTextActive]}>
                ₹ Under 50
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No grocery products found</Text>
            <Text style={styles.emptySubtitle}>Try searching with a different keyword or category.</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setQuickFilter('all');
                setSortBy('default');
              }}
            >
              <Text style={styles.resetButtonText}>View All 44+ Products</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Admin Add New Product Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="add-circle" size={24} color={colors.secondary} />
                <Text style={styles.modalHeading}>Add New Grocery Item</Text>
              </View>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.addForm}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Product Category *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.modalCatScroll}
                >
                  {categories.filter(c => c.id !== 'all').map(cat => {
                    const isSelected = newProdCat === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.modalCatChip, isSelected && styles.modalCatChipActive]}
                        onPress={() => setNewProdCat(cat.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.modalCatChipText, isSelected && styles.modalCatChipTextActive]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Selected Image Live Preview */}
              <View style={styles.imagePreviewBox}>
                <Image
                  source={{ uri: newProdImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' }}
                  style={styles.modalImagePreview}
                  resizeMode="cover"
                  onError={() =>
                    setNewProdImage(
                      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
                    )
                  }
                />
                <View style={styles.modalImageBadge}>
                  <Ionicons name="image" size={12} color={colors.white} />
                  <Text style={styles.modalImageBadgeText}>Product Photo Preview</Text>
                </View>
              </View>

              {/* Preset Product Photos Gallery (Tap to Pick) */}
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Choose Image from Gallery *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryScroll}
                >
                  {sampleGroceryImages.map((imgItem, idx) => {
                    const isSelected = newProdImage === imgItem.url;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.galleryThumbCard,
                          isSelected && styles.galleryThumbCardActive,
                        ]}
                        onPress={() => setNewProdImage(imgItem.url)}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: imgItem.url }} style={styles.galleryThumbImg} />
                        <Text style={styles.galleryThumbName} numberOfLines={1}>{imgItem.name}</Text>
                        {isSelected && (
                          <View style={styles.galleryCheckBadge}>
                            <Ionicons name="checkmark" size={10} color={colors.white} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Or Enter Custom Image URL */}
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Or Enter Custom Image URL</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="https://images.unsplash.com/photo-..."
                  placeholderTextColor={colors.textLight}
                  value={newProdImage}
                  onChangeText={setNewProdImage}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Fresh Green Capsicum"
                  placeholderTextColor={colors.textLight}
                  value={newProdName}
                  onChangeText={setNewProdName}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Price in ₹ (INR) *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 55"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                  value={newProdPrice}
                  onChangeText={setNewProdPrice}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Unit / Weight</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 500g or 1 kg"
                  placeholderTextColor={colors.textLight}
                  value={newProdUnit}
                  onChangeText={setNewProdUnit}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>Offer / Discount Tag (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 15% OFF or SPECIAL"
                  placeholderTextColor={colors.textLight}
                  value={newProdDiscount}
                  onChangeText={setNewProdDiscount}
                />
              </View>

              <TouchableOpacity
                style={styles.submitProductBtn}
                onPress={handleCreateProduct}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done" size={20} color={colors.white} />
                <Text style={styles.submitProductBtnText}>Add Product to Catalog</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerContent: {
    marginBottom: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  greetingSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  drawerShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  drawerShortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminControlCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
    gap: 10,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  adminCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 2,
  },
  adminCardSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  adminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  adminAddBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pinnedSearchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  bannerContainer: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    overflow: 'hidden',
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerHeading: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 4,
  },
  deliveryFreePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  deliveryFreeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  categorySection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  categoryList: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sortChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  productsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 2,
  },
  itemsCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  addForm: {
    gap: 12,
  },
  inputBox: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  modalInput: {
    backgroundColor: colors.surfaceHover,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  submitProductBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  offersSection: {
    marginBottom: 20,
  },
  offersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  offersTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sideScrollBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sideScrollBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  offersScrollContent: {
    gap: 12,
    paddingVertical: 4,
    paddingRight: 10,
  },
  modalCatScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  modalCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalCatChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalCatChipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  modalCatChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  flashDeliveryCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  flashLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  flashTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  flashPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  flashTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  flashAddressText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '500',
  },
  flashEtaBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashEtaNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 16,
  },
  flashEtaUnit: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
  },
  voiceMicBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceHover,
  },
  quickFilterSection: {
    marginBottom: 14,
  },
  quickFilterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  quickChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  quickChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  imagePreviewBox: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.surfaceHover,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 4,
  },
  modalImagePreview: {
    width: '100%',
    height: '100%',
  },
  modalImageBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modalImageBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  galleryScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  galleryThumbCard: {
    width: 68,
    alignItems: 'center',
    padding: 4,
    borderRadius: 10,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  galleryThumbCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  galleryThumbImg: {
    width: 54,
    height: 54,
    borderRadius: 8,
  },
  galleryThumbName: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  galleryCheckBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
