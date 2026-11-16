import React, { useEffect, useRef } from 'react';
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
import { useNetFocus } from '../state';
import { colors, spacing } from '../theme';
import { AppIcon } from '../components/AppIcon';

export function LoginScreen() {
  const { state, actions } = useNetFocus();
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

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/images/login-equipment.jpg')}
        style={styles.equipmentBackdrop}
        resizeMode="cover"
        blurRadius={2}
        accessible={false}
      />
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

      <View style={styles.brandPanel}>
        <Image
          source={require('../assets/images/netfocus-logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="NetFocus — empowering you with eyes everywhere"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Login</Text>
            <AppIcon name="cctv" size={28} color="#D7BB72" style={styles.cameraIcon} />
          </View>

          <View style={styles.field}>
            <AppIcon name="account-outline" size={23} color="#D7BB72" style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              value={state.username}
              onChangeText={actions.onUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Username / Email"
              placeholderTextColor="#9CAFD3"
              accessibilityLabel="Username or email"
            />
          </View>

          <View style={styles.field}>
            <AppIcon name="lock-outline" size={23} color="#D7BB72" style={styles.fieldIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={state.password}
              onChangeText={actions.onPasswordChange}
              secureTextEntry={!state.isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Password"
              placeholderTextColor="#9CAFD3"
              accessibilityLabel="Password"
            />
            <TouchableOpacity
              onPress={actions.onPasswordVisibilityToggle}
              style={styles.eyeButton}
              accessibilityLabel={state.isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              <AppIcon
                name={state.isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#D7BB72"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberButton}
              onPress={actions.onRememberMeToggle}
              activeOpacity={0.75}
            >
              <View style={[styles.checkbox, state.rememberMe && styles.checkboxChecked]}>
                {state.rememberMe ? <AppIcon name="check" size={14} color={colors.textWhite} /> : null}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => actions.showMessage('Contact your administrator to reset your password.')}
              activeOpacity={0.75}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.85} onPress={actions.login}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.85}
            onPress={() => actions.showMessage('Contact your administrator to create an account.')}
          >
            <AppIcon name="account-plus-outline" size={20} color="#D7BB72" />
            <Text style={styles.createButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    paddingTop: StatusBar.currentHeight ?? spacing.xl,
    backgroundColor: '#050B23',
  },
  equipmentBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '45%',
    opacity: 0.16,
  },
  glowOrb: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  glowOrbTop: { top: -150, right: -120, backgroundColor: '#1858C8' },
  glowOrbBottom: { bottom: 70, left: -175, backgroundColor: '#B58B3B' },
  brandPanel: {
    width: '78%',
    height: 92,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    backgroundColor: '#e8e8e8',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C6A75E',
    overflow: 'hidden',
    elevation: 8,
  },
  brandLogo: { width: '100%', height: '100%' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  card: {
    width: '100%',
    backgroundColor: 'rgba(10, 25, 59, 0.96)',
    borderWidth: 1,
    borderColor: '#3D5A8D',
    borderRadius: 23,
    paddingHorizontal: 19,
    paddingVertical: 17,
    elevation: 12,
    shadowColor: '#1C63D5',
    shadowOpacity: 0.28,
    shadowRadius: 18,
  },
  titleRow: { minHeight: 47, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { color: '#F5F7FF', fontSize: 28, lineHeight: 34, fontWeight: '900' as const, textAlign: 'center', flex: 1 },
  cameraIcon: { position: 'absolute', right: 3 },
  field: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3B5C91',
    borderRadius: 12,
    marginTop: 9,
    backgroundColor: '#102448',
  },
  fieldIcon: { width: 48, textAlign: 'center' },
  input: { flex: 1, height: 50, color: '#F4F7FF', paddingHorizontal: 4, paddingVertical: 0, fontSize: 15 },
  passwordInput: { paddingRight: 45 },
  eyeButton: { width: 43, height: 50, alignItems: 'center', justifyContent: 'center' },
  optionsRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  rememberButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#7692b0', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#0759bd', borderColor: '#0759bd' },
  rememberText: { color: '#D8E2F8', fontSize: 13, fontWeight: '700' as const },
  forgotText: { color: '#D7BB72', fontSize: 12, fontWeight: '800' as const },
  loginButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1457C5',
    borderWidth: 1,
    borderColor: '#D2B66D',
    borderRadius: 13,
    marginTop: 7,
    elevation: 5,
    shadowColor: '#287BFF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  loginButtonText: { color: colors.textWhite, fontSize: 17, fontWeight: '900' as const },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#63779E' },
  orText: { color: '#D7BB72', fontSize: 14, fontWeight: '700' as const },
  createButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#C6A75E',
    borderRadius: 12,
    backgroundColor: 'rgba(19, 40, 79, 0.72)',
  },
  createButtonText: { color: '#F3E6BE', fontSize: 15, fontWeight: '800' as const },
});
