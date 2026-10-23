import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn } = useApp();
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' or 'Admin'

  const handleDemoLogin = () => {
    if (selectedRole === 'Admin') {
      signIn('admin@freshmart.com', 'admin123', 'Admin');
    } else {
      signIn('customer@freshmart.com', 'customer123', 'Customer');
    }
  };

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 14) + 10;

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPadding, paddingBottom: Math.max(insets.bottom, 24) + 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Row with KRIXXEEY styled above Fresh */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={24} color={colors.primary} />
          </View>
          <View style={styles.brandTextColumn}>
            <Text style={styles.krixxeeyOverline}>K R I X X E E Y</Text>
            <Text style={styles.brandTitle}>
              Fresh<Text style={styles.brandHighlight}>Mart</Text>
            </Text>
          </View>
        </View>

        {/* Role Selector: Customer vs Admin */}
        <View style={styles.roleSelectorBox}>
          <Text style={styles.roleSelectLabel}>Select User Portal:</Text>
          <View style={styles.roleToggleRow}>
            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'Customer' && styles.roleTabActive]}
              onPress={() => setSelectedRole('Customer')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={16}
                color={selectedRole === 'Customer' ? colors.white : colors.text}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Customer' && styles.roleTabTextActive,
                ]}
              >
                Customer Portal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, selectedRole === 'Admin' && styles.roleTabAdminActive]}
              onPress={() => setSelectedRole('Admin')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={selectedRole === 'Admin' ? colors.white : colors.text}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Admin' && styles.roleTabTextActive,
                ]}
              >
                Admin Portal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Visual */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.floatingBadge}>
            <Ionicons
              name={selectedRole === 'Admin' ? 'shield-half' : 'flash'}
              size={16}
              color={selectedRole === 'Admin' ? colors.secondary : colors.primary}
            />
            <Text style={styles.floatingBadgeText}>
              {selectedRole === 'Admin' ? 'Admin Store Management' : '15 Mins Express Delivery'}
            </Text>
          </View>
        </View>

        {/* Main Pitch */}
        <View style={styles.contentSection}>
          <Text style={styles.headline}>
            {selectedRole === 'Admin' ? (
              <>FreshMart <Text style={{ color: colors.secondary }}>Admin</Text> Control Center</>
            ) : (
              <>Fresh Groceries <Text style={styles.highlightText}>Delivered</Text> To Your Doorstep</>
            )}
          </Text>
          <Text style={styles.subheadline}>
            {selectedRole === 'Admin'
              ? 'Manage daily grocery products, oversee inventory, track orders, and view Indian Rupee (₹) catalog analytics.'
              : 'Order daily organic fruits, farm-fresh vegetables, dairy, and bakery with Indian Rupee (₹) pricing and fast delivery.'}
          </Text>

          {/* Value Props */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>100% Organic</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="pricetag" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Best ₹ Rates</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name={selectedRole === 'Admin' ? 'settings' : 'bicycle'}
                size={16}
                color={colors.primary}
              />
              <Text style={styles.featureText}>
                {selectedRole === 'Admin' ? 'Inventory' : 'Fast Delivery'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                selectedRole === 'Admin' && { backgroundColor: colors.secondary },
              ]}
              onPress={() => navigation.navigate('SignIn', { initialRole: selectedRole })}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {selectedRole === 'Admin' ? 'Admin Sign In' : 'Customer Sign In'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SignUp', { initialRole: selectedRole })}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>
                {selectedRole === 'Admin'
                  ? 'Register as Store Admin (Sign Up)'
                  : 'Create Customer Account (Sign Up)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleDemoLogin}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.guestButtonText,
                  selectedRole === 'Admin' && { color: colors.secondary },
                ]}
              >
                ⚡ 1-Tap {selectedRole} Demo Login →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center',
    marginBottom: 8,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextColumn: {
    justifyContent: 'center',
  },
  krixxeeyOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 3.5,
    marginBottom: -2,
    textTransform: 'uppercase',
  },
  brandTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: colors.primary,
  },
  roleSelectorBox: {
    marginVertical: 6,
  },
  roleSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  roleToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabAdminActive: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  roleTabTextActive: {
    color: colors.white,
  },
  heroImageContainer: {
    width: '100%',
    height: 210,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  contentSection: {
    marginTop: 4,
  },
  headline: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 33,
    textAlign: 'center',
  },
  highlightText: {
    color: colors.primary,
  },
  subheadline: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  actionContainer: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.surfaceHover,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  guestButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
