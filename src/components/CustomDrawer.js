import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function CustomDrawer(props) {
  const { user, signOut, favourites, getCartCount } = useApp();
  const cartCount = getCartCount();
  const isAdmin = user?.role === 'Admin';

  // Customer navigation items
  const customerItems = [
    {
      label: 'Home & Grocery Store',
      icon: 'storefront-outline',
      badge: null,
      targetTab: 'ProductsTab',
    },
    {
      label: 'Daily Grocery Products',
      icon: 'basket-outline',
      badge: null,
      targetTab: 'ProductsTab',
    },
    {
      label: 'Favourite Products',
      icon: 'heart-outline',
      badge: favourites.length > 0 ? favourites.length : null,
      targetTab: 'FavouriteTab',
    },
    {
      label: 'My Shopping Cart',
      icon: 'cart-outline',
      badge: cartCount > 0 ? cartCount : null,
      targetTab: 'CartTab',
    },
    {
      label: 'Customer Profile',
      icon: 'person-outline',
      badge: null,
      targetTab: 'ProfileTab',
    },
    {
      label: 'Edit Customer Profile',
      icon: 'create-outline',
      badge: null,
      screenName: 'EditProfile',
    },
  ];

  // Admin navigation items: ONLY Product catalog & Add Product (No Cart, Favourites, Profile)
  const adminItems = [
    {
      label: 'Grocery Products Catalog',
      icon: 'basket-outline',
      badge: null,
      targetTab: 'ProductsTab',
    },
  ];

  const drawerItems = isAdmin ? adminItems : customerItems;

  const handleNavigate = (item) => {
    props.navigation.closeDrawer();
    if (item.screenName) {
      props.navigation.navigate('AppStack', { screen: item.screenName });
    } else if (item.targetTab) {
      props.navigation.navigate('AppStack', {
        screen: 'MainTabs',
        params: { screen: item.targetTab },
      });
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out Confirmation',
      `Are you sure you want to sign out from ${isAdmin ? 'Admin Portal' : 'your customer account'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            props.navigation.closeDrawer();
            signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={[styles.header, isAdmin && styles.adminHeader]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <View style={[styles.onlineBadge, isAdmin && styles.adminOnlineBadge]} />
        </View>

        <Text style={styles.userName} numberOfLines={1}>
          {isAdmin ? 'KRIXXEY' : user.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>

        <View style={[styles.roleBadge, isAdmin && styles.adminRoleBadge]}>
          <Ionicons
            name={isAdmin ? 'shield-half' : 'shield-checkmark'}
            size={14}
            color={isAdmin ? colors.secondary : colors.primaryDark}
          />
          <Text style={[styles.roleText, isAdmin && styles.adminRoleText]}>
            {isAdmin ? 'Store Administrator' : 'Verified Customer'}
          </Text>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>
          {isAdmin ? 'ADMIN PORTAL MENU' : 'APP NAVIGATION'}
        </Text>

        {drawerItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.drawerItem}
              onPress={() => handleNavigate(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <View style={[styles.iconBox, isAdmin && styles.adminIconBox]}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isAdmin ? colors.secondary : colors.primary}
                  />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
              </View>

              {item.badge !== null && (
                <View style={styles.itemBadge}>
                  <Text style={styles.itemBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* Quick Info Box */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name={isAdmin ? "storefront-outline" : "location-outline"}
              size={18}
              color={isAdmin ? colors.secondary : colors.primary}
            />
            <Text style={styles.infoTitle}>
              {isAdmin ? "Admin Controlled Catalog" : "Delivery Address"}
            </Text>
          </View>
          <Text style={styles.infoText} numberOfLines={2}>
            {isAdmin
              ? "Administrator has full access to view, update, and manage grocery stock and pricing."
              : user.address}
          </Text>
        </View>
      </DrawerContentScrollView>

      {/* Footer / Sign Out */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out ({user.role})</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>FreshMart App v2.0 • Admin & Customer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 20,
    backgroundColor: colors.primaryMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  adminHeader: {
    backgroundColor: colors.secondaryLight,
  },
  avatarContainer: {
    position: 'relative',
    width: 68,
    height: 68,
    marginBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  adminOnlineBadge: {
    backgroundColor: colors.secondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  adminRoleBadge: {
    backgroundColor: '#FEF3C7',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminRoleText: {
    color: '#B45309',
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginVertical: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adminIconBox: {
    backgroundColor: colors.secondaryLight,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemBadge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  itemBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
    marginHorizontal: 8,
  },
  infoCard: {
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 14,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
    marginTop: 10,
  },
});
