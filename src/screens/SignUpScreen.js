import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function SignUpScreen({ route, navigation }) {
  const { signUp } = useApp();
  const insets = useSafeAreaInsets();
  const initialRole = route.params?.initialRole || 'Customer';

  const [role, setRole] = useState(initialRole); // 'Customer' or 'Admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isAdmin = role === 'Admin';

  const handleSignUp = () => {
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
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    const result = signUp(name.trim(), email.trim(), password, role);
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message);
    }
  };

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 14) + 8;

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: topPadding, paddingBottom: Math.max(insets.bottom, 20) + 12 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Role Switcher */}
          <View style={styles.roleToggleWrapper}>
            <TouchableOpacity
              style={[styles.roleTab, !isAdmin && styles.roleTabCustomerActive]}
              onPress={() => {
                setRole('Customer');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={16}
                color={!isAdmin ? colors.white : colors.text}
              />
              <Text style={[styles.roleTabText, !isAdmin && styles.roleTabTextActive]}>
                Customer Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, isAdmin && styles.roleTabAdminActive]}
              onPress={() => {
                setRole('Admin');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={isAdmin ? colors.white : colors.text}
              />
              <Text style={[styles.roleTabText, isAdmin && styles.roleTabTextActive]}>
                Admin Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={[styles.iconCircle, isAdmin && { backgroundColor: colors.secondaryLight }]}>
              <Ionicons
                name={isAdmin ? "shield-outline" : "person-add-outline"}
                size={40}
                color={isAdmin ? colors.secondary : colors.primary}
              />
            </View>
            <Text style={styles.title}>
              {isAdmin ? "Admin Registration" : "Customer Registration"}
            </Text>
            <Text style={styles.subtitle}>
              {isAdmin
                ? "Create a Store Administrator account to manage groceries and stock."
                : "Create your customer account to start ordering fresh groceries."}
            </Text>
            <View style={[styles.roleTag, isAdmin && { backgroundColor: '#FEF3C7' }]}>
              <Ionicons
                name={isAdmin ? "shield-checkmark" : "checkmark-done"}
                size={14}
                color={isAdmin ? "#B45309" : colors.primaryDark}
              />
              <Text style={[styles.roleTagText, isAdmin && { color: "#B45309" }]}>
                {isAdmin ? "Store Administrator Account" : "Customer Account"}
              </Text>
            </View>
          </View>

          {/* Validation Feedback Messages */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{role} Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isAdmin ? "e.g. KRIXXEY" : "e.g. Jeevika Bala"}
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{role} Email Address *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isAdmin ? "admin@freshmart.com" : "customer@freshmart.com"}
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password * (min 4 characters)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a secure password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.signUpButton,
                isAdmin && { backgroundColor: colors.secondary },
              ]}
              onPress={handleSignUp}
              activeOpacity={0.85}
            >
              <Text style={styles.signUpButtonText}>
                Register as {role}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn', { initialRole: role })}>
              <Text style={[styles.signInLink, isAdmin && { color: colors.secondary }]}>
                Sign In as {role}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    paddingHorizontal: 24,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  roleToggleWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHover,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
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
  roleTabCustomerActive: {
    backgroundColor: colors.primary,
  },
  roleTabAdminActive: {
    backgroundColor: colors.secondary,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  roleTabTextActive: {
    color: colors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  successText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 5,
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  eyeButton: {
    padding: 6,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
