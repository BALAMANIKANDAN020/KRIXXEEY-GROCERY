import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const FALLBACK_GROCERY_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

export default function CartScreen({ navigation }) {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    placeOrder,
    getCartSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getCartTotal,
    discountPercent,
    applyPromo,
    user,
  } = useApp();

  const [inputPromo, setInputPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee();
  const total = getCartTotal();

  const handleApplyPromo = () => {
    if (!inputPromo.trim()) {
      setPromoSuccess(false);
      setPromoMessage('Please enter a coupon (Try: FRESH10 or GROCERY20).');
      return;
    }
    const res = applyPromo(inputPromo);
    setPromoSuccess(res.success);
    setPromoMessage(res.message);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = placeOrder();
    setLastPlacedOrder(order);
    setOrderModalVisible(true);
  };

  const handleModalClose = () => {
    setOrderModalVisible(false);
    navigation.navigate('ProductsTab');
  };

  const renderCartItem = ({ item }) => {
    const itemTotal = item.product.price * item.quantity;
    const isImgFailed = failedImages[item.product.id];
    return (
      <View style={styles.cartCard}>
        <Image
          source={{ uri: isImgFailed ? FALLBACK_GROCERY_IMAGE : item.product.image }}
          style={styles.productThumb}
          onError={() => setFailedImages(prev => ({ ...prev, [item.product.id]: true }))}
        />

        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.productUnit}>{item.product.unit}</Text>
          <Text style={styles.productUnitPrice}>₹{item.product.price} each</Text>
        </View>

        <View style={styles.quantityAndPriceCol}>
          <TouchableOpacity
            style={styles.trashBtn}
            onPress={() => removeFromCart(item.product.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyControlBtn}
              onPress={() => decreaseQuantity(item.product.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={[styles.qtyControlBtn, styles.qtyControlBtnPlus]}
              onPress={() => increaseQuantity(item.product.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>₹{itemTotal}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header
        title="My Shopping Cart"
        subtitle={`${cart.length} grocery items (₹ INR)`}
        showDrawer={true}
        showCart={false}
      />

      {cart.length > 0 ? (
        <FlatList
          data={cart}
          keyExtractor={item => item.product.id}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              {/* Delivery Address Review */}
              <View style={styles.deliveryCard}>
                <View style={styles.deliveryHeader}>
                  <View style={styles.deliveryIconBox}>
                    <Ionicons name="location" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deliveryTitle}>Deliver to Customer Address</Text>
                    <Text style={styles.deliveryAddress} numberOfLines={2}>
                      {user.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeAddressBtn}
                    onPress={() => navigation.navigate('EditProfile')}
                  >
                    <Text style={styles.changeAddressText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Promo Code Input */}
              <View style={styles.promoCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Ionicons name="pricetag" size={16} color={colors.primary} />
                  <Text style={styles.promoTitle}>Have a Coupon or Promo Code?</Text>
                </View>
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter or tap coupon below"
                    placeholderTextColor={colors.textLight}
                    autoCapitalize="characters"
                    value={inputPromo}
                    onChangeText={text => {
                      setInputPromo(text);
                      if (promoMessage) setPromoMessage('');
                    }}
                  />
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={handleApplyPromo}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* 1-Tap Quick Coupon Pills */}
                <View style={styles.couponChipsRow}>
                  {[
                    { code: 'FRESH10', desc: '10% OFF' },
                    { code: 'SUPER25', desc: '25% OFF' },
                    { code: 'KRIXXEY50', desc: '30% VIP' },
                  ].map(c => (
                    <TouchableOpacity
                      key={c.code}
                      style={styles.couponChip}
                      onPress={() => {
                        setInputPromo(c.code);
                        const res = applyPromo(c.code);
                        setPromoSuccess(res.success);
                        setPromoMessage(res.message);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.couponChipCode}>{c.code}</Text>
                      <Text style={styles.couponChipDesc}>{c.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {promoMessage ? (
                  <Text
                    style={[
                      styles.promoStatusText,
                      { color: promoSuccess ? colors.success : colors.danger },
                    ]}
                  >
                    {promoMessage}
                  </Text>
                ) : null}
              </View>

              {/* Order Summary with Indian Rupee (₹) */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Bill Summary (₹ INR)</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cart Subtotal</Text>
                  <Text style={styles.summaryValue}>₹{Math.round(subtotal)}</Text>
                </View>

                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Special Discount ({discountPercent}%)
                    </Text>
                    <Text style={[styles.summaryValue, styles.discountText]}>
                      -₹{Math.round(discount)}
                    </Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    {delivery === 0 ? (
                      <Text style={{ color: colors.primary, fontWeight: '700' }}>
                        FREE (Orders &gt; ₹299)
                      </Text>
                    ) : (
                      `₹${delivery}`
                    )}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>₹{Math.round(total)}</Text>
                </View>

                <Text style={styles.savingsNote}>
                  🎉 You are saving ₹{Math.round(discount + (delivery === 0 ? 30 : 0))} on this grocery order!
                </Text>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={handleCheckout}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutBtnText}>
                  Proceed to Checkout • ₹{Math.round(total)}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={54} color={colors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from Daily Grocery Products or Favourites screen to place your order with Indian Rupee (₹) pricing.
          </Text>
          <TouchableOpacity
            style={styles.startShopBtn}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Ionicons name="bag-add-outline" size={18} color={colors.white} />
            <Text style={styles.startShopBtnText}>Start Shopping Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order Success Modal */}
      <Modal
        visible={orderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={44} color={colors.white} />
            </View>

            <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Thank you, {user.name}! Your fresh groceries are being packed and will arrive at your address in 15-20 minutes.
            </Text>

            <View style={styles.modalDetailsBox}>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Order ID:</Text>
                <Text style={styles.modalRowValue}>{lastPlacedOrder?.id || 'ORD-9921'}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Total Amount Paid:</Text>
                <Text style={styles.modalRowValue}>₹{lastPlacedOrder?.total || Math.round(total)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Delivery To:</Text>
                <Text style={styles.modalRowValue} numberOfLines={1}>{user.address.split(',')[0]}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Payment Mode:</Text>
                <Text style={styles.modalRowValue}>Cash on Delivery / UPI</Text>
              </View>
            </View>

            {/* Live 15-Minute Delivery Tracker */}
            <View style={styles.trackerContainer}>
              <View style={styles.trackerHeader}>
                <View style={styles.pulseLiveDot} />
                <Text style={styles.trackerTitle}>LIVE DELIVERY STATUS</Text>
                <Text style={styles.etaText}>⚡ 14 MINS</Text>
              </View>

              <View style={styles.trackerTimeline}>
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconCircle, styles.timelineIconDone]}>
                    <Ionicons name="checkmark" size={12} color={colors.white} />
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>Order Placed & Confirmed</Text>
                    <Text style={styles.stepSub}>Payment: Cash on Delivery / UPI</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconCircle, styles.timelineIconDone]}>
                    <Ionicons name="leaf" size={12} color={colors.white} />
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>Produce Handpicked Fresh</Text>
                    <Text style={styles.stepSub}>Triple inspected organic packaging</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineStep}>
                  <View style={[styles.timelineIconCircle, styles.timelineIconActive]}>
                    <Ionicons name="bicycle" size={14} color={colors.white} />
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, { color: colors.primaryDark }]}>
                      Out for Express Delivery
                    </Text>
                    <Text style={styles.stepSub}>Partner Priya is on her way to you</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={handleModalClose}
            >
              <Text style={styles.modalDoneText}>Continue Shopping</Text>
            </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 24,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  productThumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.surfaceHover,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  productUnit: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productUnitPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 4,
  },
  quantityAndPriceCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 76,
  },
  trashBtn: {
    padding: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  qtyControlBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControlBtnPlus: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    minWidth: 16,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  footerContainer: {
    marginTop: 8,
  },
  deliveryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliveryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  deliveryAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  changeAddressBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surfaceHover,
    borderRadius: 8,
  },
  changeAddressText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  promoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.text,
  },
  applyBtn: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  promoStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  discountText: {
    color: colors.danger,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  savingsNote: {
    fontSize: 12,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  startShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  startShopBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  modalDetailsBox: {
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginVertical: 16,
    gap: 8,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalRowLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalRowValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    maxWidth: 160,
  },
  modalDoneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalDoneText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  couponChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  couponChip: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  couponChipCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  couponChipDesc: {
    fontSize: 9,
    color: colors.primaryDark,
    marginTop: 1,
  },
  trackerContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  trackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  pulseLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  trackerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    flex: 1,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  trackerTimeline: {
    gap: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconDone: {
    backgroundColor: colors.primary,
  },
  timelineIconActive: {
    backgroundColor: colors.secondary,
  },
  timelineLine: {
    width: 2,
    height: 8,
    backgroundColor: '#D1D5DB',
    marginLeft: 10,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  stepSub: {
    fontSize: 9,
    color: colors.textSecondary,
  },
});
