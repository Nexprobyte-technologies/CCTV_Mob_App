import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppIcon, AppIconName } from '../components/AppIcon';
import { useNetFocus } from '../state';
import { colors, spacing } from '../theme';

export function CreateAccountScreen() {
  const { actions } = useNetFocus();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [glow]);

  const renderField = (
    icon: AppIconName,
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    options: { email?: boolean; password?: boolean } = {},
  ) => (
    <View style={styles.field}>
      <AppIcon name={icon} size={22} color={GOLD} style={styles.fieldIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CAFD3"
        autoCapitalize={options.email ? 'none' : 'words'}
        autoCorrect={false}
        keyboardType={options.email ? 'email-address' : 'default'}
        secureTextEntry={options.password && !passwordVisible}
        accessibilityLabel={label}
      />
      {options.password ? (
        <TouchableOpacity
          style={styles.eyeButton}
          activeOpacity={0.75}
          onPress={() => setPasswordVisible((visible) => !visible)}
          accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
        >
          <AppIcon
            name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={GOLD}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const handleCreateAccount = () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      actions.showMessage('Please complete all fields.');
      return;
    }
    if (password !== confirmPassword) {
      actions.showMessage('Passwords do not match.');
      return;
    }
    actions.showMessage('Account registration is not connected yet.');
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowOrb,
          styles.glowOrbTop,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.16, 0.34] }),
            transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.12] }) }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowOrb,
          styles.glowOrbBottom,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.08] }),
            transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [1.08, 0.88] }) }],
          },
        ]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandPanel}>
          <Image
            source={require('../assets/images/netfocus-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="NetFocus logo"
          />
        </View>

        <View style={styles.heading}>
          <Text style={styles.title}>Create New Account</Text>
          <Text style={styles.subtitle}>Join your secure NetFocus console</Text>
        </View>

        <View style={styles.card}>
          {renderField('account-outline', 'Full Name', fullName, setFullName)}
          {renderField('email-outline', 'Email Address', email, setEmail, { email: true })}
          {renderField('lock-outline', 'Password', password, setPassword, { password: true })}
          {renderField('lock-check-outline', 'Confirm Password', confirmPassword, setConfirmPassword, { password: true })}

          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.85}
            onPress={handleCreateAccount}
            accessibilityRole="button"
          >
            <AppIcon name="account-plus-outline" size={21} color={colors.textWhite} />
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            activeOpacity={0.75}
            onPress={actions.navigateBack}
            accessibilityRole="button"
          >
            <Text style={styles.signInPrompt}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const GOLD = '#D7BB72';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    paddingTop: StatusBar.currentHeight ?? spacing.xl,
    backgroundColor: '#050B23',
  },
  glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  glowOrbTop: { top: -150, right: -120, backgroundColor: '#1858C8' },
  glowOrbBottom: { bottom: 60, left: -175, backgroundColor: '#B58B3B' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  brandPanel: {
    width: '66%',
    height: 76,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: '#E8E8E8',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C6A75E',
    overflow: 'hidden',
  },
  brandLogo: { width: '100%', height: '100%' },
  heading: { alignItems: 'center', marginBottom: spacing.lg },
  title: { color: '#F5F7FF', fontSize: 25, fontWeight: '900' as const, textAlign: 'center' },
  subtitle: { color: '#B6C7E4', fontSize: 13, marginTop: spacing.xs, textAlign: 'center' },
  card: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: 'rgba(10, 25, 59, 0.96)',
    borderWidth: 1,
    borderColor: '#3D5A8D',
    borderRadius: 22,
    elevation: 10,
    shadowColor: '#1C63D5',
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  field: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: '#102448',
    borderWidth: 1.5,
    borderColor: '#3B5C91',
    borderRadius: 12,
  },
  fieldIcon: { width: 46, textAlign: 'center' },
  input: { flex: 1, height: 52, color: '#F4F7FF', paddingHorizontal: 4, paddingVertical: 0, fontSize: 14 },
  eyeButton: { width: 42, height: 52, alignItems: 'center', justifyContent: 'center' },
  createButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    backgroundColor: '#1457C5',
    borderWidth: 1,
    borderColor: '#D2B66D',
    borderRadius: 13,
    elevation: 5,
  },
  createButtonText: { color: colors.textWhite, fontSize: 16, fontWeight: '900' as const },
  signInButton: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, paddingVertical: spacing.xs },
  signInPrompt: { color: '#B6C7E4', fontSize: 13 },
  signInLink: { color: GOLD, fontSize: 13, fontWeight: '800' as const },
});
