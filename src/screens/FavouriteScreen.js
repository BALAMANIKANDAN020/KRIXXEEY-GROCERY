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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const FALLBACK_GROCERY_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

export default function FavouriteScreen({ navigation }) {
  const { favourites, removeFavourite, addToCart } = useApp();
  const [failedImages, setFailedImages] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header
        title="My Favourites"
        subtitle={`${favourites.length} saved grocery items`}
        showDrawer={true}
        showCart={true}
      />

      <FlatList
        data={favourites}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductPress(item)}
            activeOpacity={0.85}
          >
            {/* Image */}
            <Image
              source={{ uri: failedImages[item.id] ? FALLBACK_GROCERY_IMAGE : item.image }}
              style={styles.productImage}
              onError={() => setFailedImages(prev => ({ ...prev, [item.id]: true }))}
            />

            {/* Info */}
            <View style={styles.infoCol}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={colors.secondary} />
                <Text style={styles.ratingText}>{item.rating} ({item.reviewsCount})</Text>
              </View>

              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productUnit}>{item.unit}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                )}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFavourite(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="heart-dislike" size={20} color={colors.danger} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addCartBtn}
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="cart-outline" size={16} color={colors.white} />
                <Text style={styles.addCartText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-outline" size={48} color={colors.danger} />
            </View>
            <Text style={styles.emptyTitle}>No Favourites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any grocery product to save it here for fast ordering!
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('ProductsTab')}
            >
              <Ionicons name="bag-handle-outline" size={18} color={colors.white} />
              <Text style={styles.exploreBtnText}>Browse Grocery Products</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: colors.surfaceHover,
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  productUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  actionCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 76,
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addCartText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.dangerLight,
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
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
