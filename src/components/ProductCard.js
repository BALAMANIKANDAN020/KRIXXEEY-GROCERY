import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const FALLBACK_GROCERY_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

// Horizontal Offer / Deal Card (Side-scrolling carousel)
export function OfferDealCard({ product }) {
  const navigation = useNavigation();
  const { isFavourite, toggleFavourite, addToCart, user, cart } = useApp();
  const favourite = isFavourite(product.id);
  const isAdmin = user?.role === 'Admin';

  const [imgUri, setImgUri] = useState(product?.image || FALLBACK_GROCERY_IMAGE);

  useEffect(() => {
    setImgUri(product?.image || FALLBACK_GROCERY_IMAGE);
  }, [product?.image]);

  const cartItem = cart?.find(ci => ci.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {/* Top Banner on Deal Image */}
      <View style={styles.dealImageStage}>
        <Image
          source={{ uri: imgUri }}
          style={styles.dealImage}
          resizeMode="cover"
          onError={() => setImgUri(FALLBACK_GROCERY_IMAGE)}
        />

        {/* Hot Discount Pill */}
        <View style={styles.dealDiscountPill}>
          <Ionicons name="flame" size={10} color={colors.white} />
          <Text style={styles.dealDiscountText}>{product.discount || 'HOT'}</Text>
        </View>

        {!isAdmin && (
          <TouchableOpacity
            style={styles.dealFavGlass}
            onPress={() => toggleFavourite(product)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favourite ? 'heart' : 'heart-outline'}
              size={15}
              color={favourite ? colors.danger : colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        <View style={styles.dealRatingPill}>
          <Ionicons name="star" size={10} color={colors.secondary} />
          <Text style={styles.dealRatingText}>{product.rating}</Text>
        </View>
      </View>

      <View style={styles.dealInfo}>
        <Text style={styles.dealName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.dealUnit}>{product.unit}</Text>

        <View style={styles.dealBottomRow}>
          <View>
            <Text style={styles.dealPrice}>₹{product.price}</Text>
            {product.originalPrice ? (
              <Text style={styles.dealOriginalPrice}>₹{product.originalPrice}</Text>
            ) : null}
          </View>

          {!isAdmin ? (
            <TouchableOpacity
              style={[styles.miniAddCapsule, inCartQty > 0 && styles.miniAddCapsuleActive]}
              onPress={() => addToCart(product, 1)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={inCartQty > 0 ? "checkmark" : "add"}
                size={13}
                color={inCartQty > 0 ? colors.white : colors.primaryDark}
              />
              <Text style={[styles.miniAddText, inCartQty > 0 && styles.miniAddTextActive]}>
                {inCartQty > 0 ? `${inCartQty}` : 'ADD'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.adminMiniTag}>
              <Text style={styles.adminMiniTagText}>Stock</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Standard Unique Grid & Horizontal Product Card
export default function ProductCard({ product, horizontal = false }) {
  const navigation = useNavigation();
  const { isFavourite, toggleFavourite, addToCart, user, cart } = useApp();
  const favourite = isFavourite(product.id);
  const isAdmin = user?.role === 'Admin';

  const [imgUri, setImgUri] = useState(product?.image || FALLBACK_GROCERY_IMAGE);

  useEffect(() => {
    setImgUri(product?.image || FALLBACK_GROCERY_IMAGE);
  }, [product?.image]);

  const cartItem = cart?.find(ci => ci.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handlePress = () => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleFavoritePress = () => {
    toggleFavourite(product);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Horizontal Card (Used in Favourites & Search Results)
  if (horizontal) {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: imgUri }}
          style={styles.horizontalImage}
          onError={() => setImgUri(FALLBACK_GROCERY_IMAGE)}
        />
        <View style={styles.horizontalInfo}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productUnit}>{product.unit}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.secondary} />
            <Text style={styles.ratingText}>{product.rating} ({product.reviewsCount})</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>
        </View>
        <View style={styles.horizontalActions}>
          {!isAdmin && (
            <TouchableOpacity
              style={styles.favSmallBtn}
              onPress={handleFavoritePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={favourite ? 'heart' : 'heart-outline'}
                size={18}
                color={favourite ? colors.danger : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          {!isAdmin && (
            <TouchableOpacity
              style={[styles.addCapsuleBtn, inCartQty > 0 && styles.addCapsuleBtnActive]}
              onPress={handleAddToCart}
              activeOpacity={0.75}
            >
              <Ionicons
                name={inCartQty > 0 ? "checkmark" : "add"}
                size={14}
                color={inCartQty > 0 ? colors.white : colors.primaryDark}
              />
              <Text style={[styles.addCapsuleText, inCartQty > 0 && styles.addCapsuleTextActive]}>
                {inCartQty > 0 ? `${inCartQty}` : 'ADD'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Unique 2-Column Grid Card Design
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {/* Visual Image Stage with Badges Overlay */}
      <View style={styles.imageStage}>
        <Image
          source={{ uri: imgUri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgUri(FALLBACK_GROCERY_IMAGE)}
        />

        {/* Top-Left: Discount Tag */}
        {product.discount ? (
          <View style={styles.discountBadge}>
            <Ionicons name="flame" size={10} color={colors.white} />
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        ) : null}

        {/* Top-Right: Glass Floating Heart Button */}
        {!isAdmin ? (
          <TouchableOpacity
            style={styles.favGlassBtn}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favourite ? 'heart' : 'heart-outline'}
              size={16}
              color={favourite ? colors.danger : colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.adminTagPill}>
            <Text style={styles.adminTagText}>Catalog</Text>
          </View>
        )}

        {/* Bottom-Left: 15-Min Delivery Tag */}
        <View style={styles.etaPill}>
          <Ionicons name="flash" size={10} color="#D97706" />
          <Text style={styles.etaPillText}>15 MINS</Text>
        </View>

        {/* Bottom-Right: Micro Rating Tag */}
        <View style={styles.microRatingPill}>
          <Ionicons name="star" size={10} color={colors.secondary} />
          <Text style={styles.microRatingText}>{product.rating}</Text>
        </View>
      </View>

      {/* Product Content */}
      <View style={styles.cardContent}>
        {/* Name (2 Lines for clean readable Tamil produce titles) */}
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Unit & Origin Tag */}
        <View style={styles.unitRow}>
          <Text style={styles.productUnit}>{product.unit}</Text>
        </View>

        {/* Price & Action Row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceColumn}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice ? (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            ) : null}
          </View>

          {!isAdmin ? (
            <TouchableOpacity
              style={[styles.addCapsuleBtn, inCartQty > 0 && styles.addCapsuleBtnActive]}
              onPress={handleAddToCart}
              activeOpacity={0.75}
            >
              <Ionicons
                name={inCartQty > 0 ? "checkmark" : "add"}
                size={14}
                color={inCartQty > 0 ? colors.white : colors.primaryDark}
              />
              <Text
                style={[
                  styles.addCapsuleText,
                  inCartQty > 0 && styles.addCapsuleTextActive,
                ]}
              >
                {inCartQty > 0 ? `${inCartQty}` : 'ADD'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stockStatusBadge}>
              <Text style={styles.stockStatusText}>In Stock</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Unique Modern Card Structure
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageStage: {
    width: '100%',
    height: 124,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  favGlassBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  adminTagPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  etaPill: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  etaPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#92400E',
  },
  microRatingPill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  microRatingText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
  },
  cardContent: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 18,
    minHeight: 36,
  },
  unitRow: {
    marginVertical: 4,
  },
  productUnit: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceColumn: {
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },

  // Unique Tactile + ADD Capsule Button
  addCapsuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  addCapsuleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addCapsuleText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  addCapsuleTextActive: {
    color: colors.white,
  },
  stockStatusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  // Deal / Offer Horizontal Scroll Card Styles
  dealCard: {
    width: 156,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 9,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  dealImageStage: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealDiscountPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DC2626',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dealDiscountText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
  },
  dealFavGlass: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealRatingPill: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 5,
  },
  dealRatingText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
  },
  dealInfo: {
    marginTop: 6,
  },
  dealName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 16,
  },
  dealUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  dealBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dealPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  dealOriginalPrice: {
    fontSize: 9,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  miniAddCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  miniAddCapsuleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  miniAddText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  miniAddTextActive: {
    color: colors.white,
  },
  adminMiniTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminMiniTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
  },

  // Horizontal Card
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
  },
  horizontalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginVertical: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  horizontalActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
  },
  favSmallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
