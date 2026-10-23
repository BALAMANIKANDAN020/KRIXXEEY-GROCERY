import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function Header({
  title,
  subtitle,
  showBack = false,
  showDrawer = true,
  showCart = true,
  rightAction,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { getCartCount, user, signOut } = useApp();
  const cartCount = getCartCount();
  const isAdmin = user?.role === 'Admin';

  const handleLeftPress = () => {
    if (showBack) {
      navigation.goBack();
    } else if (showDrawer) {
      try {
        navigation.dispatch(DrawerActions.openDrawer());
      } catch (e) {
        if (navigation.openDrawer) {
          navigation.openDrawer();
        }
      }
    }
  };

  const handleCartPress = () => {
    try {
      navigation.navigate('MainTabs', { screen: 'CartTab' });
    } catch (e) {
      navigation.navigate('CartTab');
    }
  };

  const handleAdminLogout = () => {
    Alert.alert(
      'Sign Out Confirmation',
      'Are you sure you want to sign out from the Admin Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  const headerTopPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 14) + 8;

  return (
    <View style={[styles.headerContainer, { paddingTop: headerTopPadding }]}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : showDrawer ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : isAdmin ? (
          /* For Admin: NO Cart icon! Show Admin Sign Out button directly */
          <TouchableOpacity
            style={styles.adminLogoutBtn}
            onPress={handleAdminLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.adminLogoutText}>Logout</Text>
          </TouchableOpacity>
        ) : showCart ? (
          /* For Customer: Show Shopping Cart with live badge */
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
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
  adminLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  adminLogoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
