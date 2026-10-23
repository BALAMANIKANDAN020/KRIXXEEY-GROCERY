import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { avatarList } from '../data/productsData';
import Header from '../components/Header';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, updateAvatar } = useApp();
  const isAdmin = user.role === 'Admin';

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (e) {
      if (navigation.openDrawer) {
        navigation.openDrawer();
      }
    }
  };

  const handleSelectAvatar = (url) => {
    updateAvatar(url);
    setAvatarModalVisible(false);
    setSuccessMessage('Profile picture updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSave = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Address cannot be empty.');
      return;
    }

    const result = updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    if (result.success) {
      setSuccessMessage('Profile details updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <Header
        title={isAdmin ? "Edit Admin Profile" : "Edit Customer Profile"}
        subtitle="Update Contact & Address Info"
        showBack={true}
        showCart={true}
        rightAction={
          <TouchableOpacity
            style={styles.headerDrawerBtn}
            onPress={handleOpenDrawer}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <View style={[styles.cameraIconBox, isAdmin && { backgroundColor: colors.secondary }]}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tapToChangeBtn}
              onPress={() => setAvatarModalVisible(true)}
            >
              <Text style={styles.tapToChangeText}>Tap photo to change avatar</Text>
            </TouchableOpacity>

            <Text style={styles.customerName}>{name || 'User'}</Text>
            <View style={[styles.roleTag, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Ionicons
                name={isAdmin ? "shield-checkmark" : "checkmark-done"}
                size={13}
                color={isAdmin ? "#B45309" : colors.primaryDark}
              />
              <Text style={[styles.roleTagText, isAdmin && { color: "#B45309" }]}>
                {isAdmin ? "Admin Account" : "Customer Account"}
              </Text>
            </View>
          </View>

          {/* Drawer Quick Trigger Banner - Note: (10 Marks) is removed */}
          <View style={styles.drawerBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.drawerBannerTitle}>Drawer Navigation</Text>
              <Text style={styles.drawerBannerSub}>
                Test Side Drawer menu navigation directly from Edit Profile screen.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.drawerBannerBtn, isAdmin && { backgroundColor: colors.secondary }]}
              onPress={handleOpenDrawer}
              activeOpacity={0.8}
            >
              <Ionicons name="menu" size={18} color={colors.white} />
              <Text style={styles.drawerBannerBtnText}>Open Drawer</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formCardTitle}>Account Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={text => {
                    setName(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter email address"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={text => {
                    setPhone(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery & Branch Address (₹ Billing) *</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={[styles.inputIcon, { marginTop: 10 }]}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={address}
                  onChangeText={text => {
                    setAddress(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter complete door no, street name, area, city and pincode"
                  placeholderTextColor={colors.textLight}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.saveBtn, isAdmin && { backgroundColor: colors.secondary }]}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Back to Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
              <Text style={styles.avatarModalTitle}>Choose New Avatar</Text>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarModalSub}>
              Select any profile picture below to instantly change your photo.
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerDrawerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraIconBox: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  tapToChangeBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
  },
  tapToChangeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  drawerBanner: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginVertical: 12,
    gap: 12,
  },
  drawerBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  drawerBannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  drawerBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  drawerBannerBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  successText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 14,
  },
  formCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
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
});
