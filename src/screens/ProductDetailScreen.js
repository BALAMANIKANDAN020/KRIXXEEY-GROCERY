import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const FALLBACK_GROCERY_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params || {};
  const { isFavourite, toggleFavourite, addToCart, getCartCount, user } = useApp();
  const isAdmin = user?.role === 'Admin';
  const insets = useSafeAreaInsets();

  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [imgUri, setImgUri] = useState(product?.image || FALLBACK_GROCERY_IMAGE);

  React.useEffect(() => {
    setImgUri(product?.image || FALLBACK_GROCERY_IMAGE);
  }, [product?.image]);

  const handleShareProduct = () => {
    Alert.alert(
      'Share Grocery Product',
      `Link to ${product.name} (₹${product.price}) copied to clipboard!\n\nShare with friends & family via WhatsApp or SMS.`,
      [{ text: 'OK' }]
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const favourite = isFavourite(product.id);
  const cartCount = getCartCount();

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2500);
  };

  const totalPrice = product.price * quantity;
  const topNavPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 12) + 6;

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Custom Top Navigation Bar */}
      <View style={[styles.topNav, { paddingTop: topNavPadding }]}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.topNavTitle}>Product Details</Text>

        <View style={styles.topRightIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={handleShareProduct}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          {!isAdmin ? (
            <>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => toggleFavourite(product)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={favourite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={favourite ? colors.danger : colors.text}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
                activeOpacity={0.7}
              >
                <Ionicons name="cart-outline" size={22} color={colors.text} />
                {cartCount > 0 && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.adminTopBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#B45309" />
              <Text style={styles.adminTopBadgeText}>Admin Catalog</Text>
            </View>
          )}
        </View>
      </View>

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.toastText}>
            Added {quantity} x {product.name} to Cart!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
            style={styles.toastAction}
          >
            <Text style={styles.toastActionText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Product Image */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: imgUri }}
            style={styles.largeImage}
            resizeMode="cover"
            onError={() => setImgUri(FALLBACK_GROCERY_IMAGE)}
          />
          {product.discount && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>{product.discount}</Text>
            </View>
          )}
          {product.isFresh && (
            <View style={styles.organicPill}>
              <Ionicons name="leaf" size={12} color={colors.primaryDark} />
              <Text style={styles.organicPillText}>100% Organic Fresh</Text>
            </View>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productUnit}>{product.unit}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.unitPrice}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              )}
            </View>
          </View>

          {/* Rating & Origin */}
          <View style={styles.metaRow}>
            <TouchableOpacity
              style={styles.ratingBadge}
              onPress={() => setReviewsModalVisible(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="star" size={14} color={colors.secondary} />
              <Text style={styles.ratingValue}>{product.rating}</Text>
              <Text style={styles.reviewCount}>({product.reviewsCount} reviews) ›</Text>
            </TouchableOpacity>

            <View style={styles.stockBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primaryDark} />
              <Text style={styles.stockText}>In Stock</Text>
            </View>

            {product.origin && (
              <View style={styles.originBadge}>
                <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.originText}>{product.origin}</Text>
              </View>
            )}
          </View>

          {/* 3-Column Highlights Row */}
          <View style={styles.perksRow}>
            <View style={styles.perkChip}>
              <Ionicons name="flash" size={13} color="#D97706" />
              <Text style={styles.perkText}>15-Min Delivery</Text>
            </View>
            <View style={styles.perkChip}>
              <Ionicons name="leaf" size={13} color={colors.primaryDark} />
              <Text style={styles.perkText}>100% Organic</Text>
            </View>
            <View style={styles.perkChip}>
              <Ionicons name="shield-checkmark" size={13} color="#7C3AED" />
              <Text style={styles.perkText}>Safe Clean Pack</Text>
            </View>
          </View>

          {/* Quantity Selector for Customer, or Inventory Status for Admin */}
          {!isAdmin ? (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionLabel}>Select Quantity</Text>
              <View style={styles.quantityPicker}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={handleDecrease}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnPlus]}
                  onPress={handleIncrease}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.adminInventoryBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="cube-outline" size={18} color="#B45309" />
                <Text style={styles.adminInventoryTitle}>Central Store Stock</Text>
              </View>
              <Text style={styles.adminInventorySub}>Available in Tamil Nadu Warehouse • Fast Local Dispatch</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeading}>Product Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Nutritional Highlights */}
          {product.nutrients && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeading}>Nutritional Facts (Per Serving)</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientValue}>{product.nutrients.calories}</Text>
                  <Text style={styles.nutrientLabel}>Calories</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientValue}>{product.nutrients.fat}</Text>
                  <Text style={styles.nutrientLabel}>Healthy Fat</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientValue}>{product.nutrients.carbs}</Text>
                  <Text style={styles.nutrientLabel}>Carbs</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientValue}>{product.nutrients.protein}</Text>
                  <Text style={styles.nutrientLabel}>Protein</Text>
                </View>
              </View>
            </View>
          )}

          {/* Free Return & Quality Guarantee */}
          <View style={styles.guaranteeBox}>
            <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.guaranteeTitle}>100% Quality & Freshness Guaranteed</Text>
              <Text style={styles.guaranteeSub}>If not satisfied, 100% instant refund or replacement.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.totalCol}>
          <Text style={styles.totalLabel}>{isAdmin ? 'Item Price' : 'Total Price'}</Text>
          <Text style={styles.totalValue}>₹{isAdmin ? product.price : totalPrice}</Text>
        </View>

        {!isAdmin ? (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons name="cart" size={20} color={colors.white} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.adminBackBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={18} color={colors.white} />
            <Text style={styles.adminBackBtnText}>Back to Catalog</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Customer Reviews & Ratings Modal */}
      <Modal
        visible={reviewsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewsModalBox}>
            <View style={styles.reviewsModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="star" size={20} color={colors.secondary} />
                <Text style={styles.reviewsModalTitle}>Verified Customer Reviews</Text>
              </View>
              <TouchableOpacity onPress={() => setReviewsModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingOverviewRow}>
              <View style={styles.bigScoreBox}>
                <Text style={styles.bigScoreText}>{product.rating}</Text>
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Ionicons key={s} name="star" size={14} color={colors.secondary} />
                  ))}
                </View>
                <Text style={styles.totalReviewsSub}>{product.reviewsCount} total ratings</Text>
              </View>
              <View style={styles.ratingBarCol}>
                <View style={styles.barItem}>
                  <Text style={styles.barLabel}>5 ★</Text>
                  <View style={styles.barTrack}><View style={[styles.barFill, { width: '84%' }]} /></View>
                  <Text style={styles.barPercent}>84%</Text>
                </View>
                <View style={styles.barItem}>
                  <Text style={styles.barLabel}>4 ★</Text>
                  <View style={styles.barTrack}><View style={[styles.barFill, { width: '12%' }]} /></View>
                  <Text style={styles.barPercent}>12%</Text>
                </View>
                <View style={styles.barItem}>
                  <Text style={styles.barLabel}>3 ★</Text>
                  <View style={styles.barTrack}><View style={[styles.barFill, { width: '4%' }]} /></View>
                  <Text style={styles.barPercent}>4%</Text>
                </View>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 260 }}>
              <View style={styles.reviewItemCard}>
                <View style={styles.reviewerHeader}>
                  <Text style={styles.reviewerName}>Priya Dharshini</Text>
                  <Text style={styles.reviewDate}>2 days ago • Verified Purchase</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 2, marginVertical: 3 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Ionicons key={s} name="star" size={12} color={colors.secondary} />
                  ))}
                </View>
                <Text style={styles.reviewComment}>
                  "Super fresh quality! Delivered in just 14 minutes by the rider. Packaged very neatly in organic paper."
                </Text>
              </View>

              <View style={styles.reviewItemCard}>
                <View style={styles.reviewerHeader}>
                  <Text style={styles.reviewerName}>Ananya Ramesh</Text>
                  <Text style={styles.reviewDate}>5 days ago • Verified Purchase</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 2, marginVertical: 3 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Ionicons key={s} name="star" size={12} color={colors.secondary} />
                  ))}
                </View>
                <Text style={styles.reviewComment}>
                  "Best organic grocery service in town. Authentic farm fresh taste and honest pricing in ₹."
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeReviewsBtn}
              onPress={() => setReviewsModalVisible(false)}
            >
              <Text style={styles.closeReviewsBtnText}>Close Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  navBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  toastBanner: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  toastText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  toastAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toastActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageCard: {
    width: '100%',
    height: 280,
    backgroundColor: colors.surfaceHover,
    position: 'relative',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  discountPill: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  discountPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  organicPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  organicPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  productUnit: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  unitPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  originalPrice: {
    fontSize: 13,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  reviewCount: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  originBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  originText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    padding: 14,
    borderRadius: 16,
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnPlus: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qtyNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  detailSection: {
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  nutrientBox: {
    flex: 1,
    backgroundColor: colors.surfaceHover,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  nutrientLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  guaranteeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  totalCol: {},
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  adminTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  adminTopBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  adminInventoryBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  adminInventoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  adminInventorySub: {
    fontSize: 11,
    color: '#B45309',
  },
  adminBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  adminBackBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  perkChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surfaceHover,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  perkText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  reviewsModalBox: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
  },
  reviewsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  ratingOverviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  bigScoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigScoreText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  totalReviewsSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingBarCol: {
    flex: 1,
    gap: 4,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  barPercent: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textLight,
    width: 26,
    textAlign: 'right',
  },
  reviewItemCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 10,
  },
  reviewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 10,
    color: colors.textLight,
  },
  reviewComment: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  closeReviewsBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  closeReviewsBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
