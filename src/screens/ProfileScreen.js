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
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { avatarList } from '../data/productsData';
import Header from '../components/Header';

export default function ProfileScreen({ navigation }) {
  const { user, signOut, favourites, getCartCount, updateAvatar, orders } = useApp();
  const cartCount = getCartCount();
  const isAdmin = user.role === 'Admin';

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);

  const handleOpenDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (e) {
      if (navigation.openDrawer) {
        navigation.openDrawer();
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out Confirmation',
      `Are you sure you want to sign out from your ${user.role} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
          },
        },
      ]
    );
  };

  const handleSelectAvatar = (url) => {
    updateAvatar(url);
    setAvatarModalVisible(false);
    Alert.alert('Success', 'Profile picture updated successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header
        title={isAdmin ? "Admin Profile" : "Customer Profile"}
        subtitle={isAdmin ? "Store Operations & Settings" : "Manage Account & Orders"}
        showDrawer={true}
        showCart={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <View style={[styles.cameraBadge, isAdmin && { backgroundColor: colors.secondary }]}>
                <Ionicons name="camera" size={14} color={colors.white} />
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.customerName}>{user.name}</Text>
              <Text style={styles.customerEmail}>{user.email}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, isAdmin && { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons
                    name={isAdmin ? "shield-checkmark" : "person"}
                    size={12}
                    color={isAdmin ? "#B45309" : colors.primaryDark}
                  />
                  <Text style={[styles.roleText, isAdmin && { color: "#B45309" }]}>
                    {isAdmin ? "Admin (Store Manager)" : "Verified Customer"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changePicPill}
                  onPress={() => setAvatarModalVisible(true)}
                >
                  <Ionicons name="image-outline" size={12} color={colors.primaryDark} />
                  <Text style={styles.changePicText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Edit Profile & Open Drawer Actions */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.editProfileBtn, isAdmin && { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color={colors.white} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.openDrawerBtn}
              onPress={handleOpenDrawer}
              activeOpacity={0.8}
            >
              <Ionicons name="menu-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.openDrawerText}>Open Drawer Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
          >
            <View style={styles.statIconCircle}>
              <Ionicons name="cart" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('MainTabs', { screen: 'FavouriteTab' })}
          >
            <View style={styles.statIconCircle}>
              <Ionicons name="heart" size={20} color={colors.danger} />
            </View>
            <Text style={styles.statValue}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => setOrdersModalVisible(true)}
          >
            <View style={styles.statIconCircle}>
              <Ionicons name="bag-check" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders (View)</Text>
          </TouchableOpacity>
        </View>

        {/* User Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>
            {isAdmin ? "Admin Account Details" : "Customer Details"}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address (₹ Rupee Billing)</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Account Registered</Text>
              <Text style={styles.infoValue}>{user.memberSince || 'October 2024'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Menu Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Navigation & Settings</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setAvatarModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="image-outline" size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>Change Profile Photo</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setOrdersModalVisible(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="receipt-outline" size={20} color={colors.secondary} />
              <Text style={styles.menuLabel}>Store Grocery Orders ({orders.length})</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={styles.menuLabel}>
                {isAdmin ? "Edit Admin Profile" : "Edit Customer Profile"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleOpenDrawer}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="grid-outline" size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>Open Side Drawer Navigation</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProductsTab' })}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="storefront-outline" size={20} color={colors.text} />
              <Text style={styles.menuLabel}>Daily Grocery Products Catalog</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('MainTabs', { screen: 'FavouriteTab' })}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="heart-outline" size={20} color={colors.text} />
              <Text style={styles.menuLabel}>View Favourites Screen</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="cart-outline" size={20} color={colors.text} />
              <Text style={styles.menuLabel}>My Cart Screen ({cartCount} items)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutBtnText}>Sign Out ({user.role})</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar Picker Modal */}
      <Modal
        visible={avatarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.avatarModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.avatarModalTitle}>Choose Profile Picture</Text>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarModalSub}>
              Select any profile picture below to instantly update your photo.
            </Text>

            <View style={styles.avatarGrid}>
              {avatarList.map((uri, index) => {
                const isSelected = user.avatar === uri;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarOptionWrapper,
                      isSelected && styles.avatarOptionSelected,
                    ]}
                    onPress={() => handleSelectAvatar(uri)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri }} style={styles.avatarOptionImage} />
                    {isSelected && (
                      <View style={styles.avatarCheckmark}>
                        <Ionicons name="checkmark" size={14} color={colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Past Orders Modal */}
      <Modal
        visible={ordersModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOrdersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ordersModalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="receipt" size={22} color={colors.primary} />
                <Text style={styles.avatarModalTitle}>Order History (₹ INR)</Text>
              </View>
              <TouchableOpacity onPress={() => setOrdersModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <View style={styles.orderStatusBadge}>
                      <Text style={styles.orderStatusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>{item.date}</Text>
                  <View style={styles.orderItemsList}>
                    {item.items.map((prod, idx) => (
                      <Text key={idx} style={styles.orderItemName}>• {prod}</Text>
                    ))}
                  </View>
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderAddressText} numberOfLines={1}>📍 {item.deliveryAddress}</Text>
                    <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyOrdersText}>No past orders found.</Text>
              }
            />
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  customerEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  changePicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  changePicText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  editProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editProfileText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  openDrawerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openDrawerText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  signOutBtnText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  avatarModalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
  },
  avatarOptionWrapper: {
    position: 'relative',
    borderRadius: 36,
    padding: 3,
  },
  avatarOptionSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarOptionImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  avatarCheckmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  orderCard: {
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  orderStatusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  orderDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderItemsList: {
    marginVertical: 6,
  },
  orderItemName: {
    fontSize: 12,
    color: colors.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 6,
  },
  orderAddressText: {
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: '60%',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  emptyOrdersText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
  },
});
