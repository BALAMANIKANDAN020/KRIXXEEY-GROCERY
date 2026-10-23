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

export default function SignInScreen({ route, navigation }) {
  const { signIn } = useApp();
  const insets = useSafeAreaInsets();
  const initialRole = route.params?.initialRole || 'Customer';

  const [role, setRole] = useState(initialRole); // 'Customer' or 'Admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isAdmin = role === 'Admin';

  const handleSignIn = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage(`Please enter your ${role.toLowerCase()} email address.`);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@mail.com).');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    const result = signIn(email.trim(), password, role);
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleFillDemo = () => {
    if (isAdmin) {
      setEmail('admin@freshmart.com');
      setPassword('admin123');
    } else {
      setEmail('customer@freshmart.com');
      setPassword('customer123');
    }
    setErrorMessage('');
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
                setEmail('');
                setPassword('');
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
                Customer Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, isAdmin && styles.roleTabAdminActive]}
              onPress={() => {
                setRole('Admin');
                setEmail('');
                setPassword('');
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
                Admin Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={[styles.iconCircle, isAdmin && { backgroundColor: colors.secondaryLight }]}>
              <Ionicons
                name={isAdmin ? "shield-checkmark-outline" : "person-circle-outline"}
                size={44}
                color={isAdmin ? colors.secondary : colors.primary}
              />
            </View>
            <Text style={styles.title}>
              {isAdmin ? "Admin Portal Sign In" : "Customer Sign In"}
            </Text>
            <Text style={styles.subtitle}>
              {isAdmin
                ? "Sign in as Store Manager to oversee products and stock."
                : "Welcome back! Sign in to order your daily groceries."}
            </Text>
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
              <Text style={styles.label}>{role} Email Address</Text>
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
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
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

            <TouchableOpacity
              style={[
                styles.signInButton,
                isAdmin && { backgroundColor: colors.secondary },
              ]}
              onPress={handleSignIn}
              activeOpacity={0.85}
            >
              <Text style={styles.signInButtonText}>
                Sign In as {role}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoFillButton, isAdmin && { borderColor: colors.secondaryLight }]}
              onPress={handleFillDemo}
              activeOpacity={0.7}
            >
              <Ionicons
                name="flash-outline"
                size={16}
                color={isAdmin ? colors.secondary : colors.primaryDark}
              />
              <Text style={[styles.demoFillText, isAdmin && { color: colors.secondary }]}>
                Quick Fill {role} Demo Credentials
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp', { initialRole: role })}>
              <Text style={[styles.signUpLink, isAdmin && { color: colors.secondary }]}>
                Sign Up as {role}
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
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
    gap: 16,
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  eyeButton: {
    padding: 6,
  },
  signInButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  demoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 14,
  },
  demoFillText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
