import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNetFocus } from '../state';
import { colors, spacing } from '../theme';
import { AppIcon } from '../components/AppIcon';

export function LoginScreen() {
  const { state, actions } = useNetFocus();

  return (
    <View style={styles.screen}>
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
            <AppIcon name="cctv" size={28} color="#061c4c" style={styles.cameraIcon} />
          </View>

          <View style={styles.field}>
            <AppIcon name="account-outline" size={23} color="#0a285b" style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              value={state.username}
              onChangeText={actions.onUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Username / Email"
              placeholderTextColor={colors.textSlate}
              accessibilityLabel="Username or email"
            />
          </View>

          <View style={styles.field}>
            <AppIcon name="lock-outline" size={23} color="#0a285b" style={styles.fieldIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={state.password}
              onChangeText={actions.onPasswordChange}
              secureTextEntry={!state.isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Password"
              placeholderTextColor={colors.textSlate}
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
                color="#0a285b"
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
            <AppIcon name="account-plus-outline" size={20} color="#0645ac" />
            <Text style={styles.createButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Image
        source={require('../assets/images/login-equipment.jpg')}
        style={styles.equipmentArtwork}
        resizeMode="cover"
        accessibilityLabel="NetFocus security cameras and recorder"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#062b66' },
  brandPanel: {
    width: '90%',
    height: 115,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  brandLogo: { width: '100%', height: '100%' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  card: {
    width: '100%',
    backgroundColor: '#fbfcff',
    borderRadius: 23,
    paddingHorizontal: 19,
    paddingVertical: 17,
    elevation: 5,
  },
  titleRow: { minHeight: 47, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { color: '#061c4c', fontSize: 28, lineHeight: 34, fontWeight: '900' as const, textAlign: 'center', flex: 1 },
  cameraIcon: { position: 'absolute', right: 3 },
  field: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#aec6e1',
    borderRadius: 12,
    marginTop: 9,
    backgroundColor: '#ffffff',
  },
  fieldIcon: { width: 48, textAlign: 'center' },
  input: { flex: 1, height: 50, color: '#092453', paddingHorizontal: 4, paddingVertical: 0, fontSize: 15 },
  passwordInput: { paddingRight: 45 },
  eyeButton: { width: 43, height: 50, alignItems: 'center', justifyContent: 'center' },
  optionsRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  rememberButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#7692b0', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#0759bd', borderColor: '#0759bd' },
  rememberText: { color: '#111b2d', fontSize: 13, fontWeight: '700' as const },
  forgotText: { color: '#0649d3', fontSize: 12, fontWeight: '800' as const },
  loginButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0755c3',
    borderRadius: 13,
    marginTop: 7,
  },
  loginButtonText: { color: colors.textWhite, fontSize: 17, fontWeight: '900' as const },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  separatorLine: { flex: 1, height: 1.5, backgroundColor: '#93b3d5' },
  orText: { color: '#0b1c39', fontSize: 14, fontWeight: '700' as const },
  createButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#0870e7',
    borderRadius: 12,
  },
  createButtonText: { color: '#063e9b', fontSize: 15, fontWeight: '800' as const },
  equipmentArtwork: { width: '100%', height: 145, flexShrink: 0 },
});
