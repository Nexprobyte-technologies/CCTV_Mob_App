import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNetFocus } from '../state';
import { AppScreen } from '../types';
import { colors, spacing } from '../theme';
import { AppIcon, AppIconName } from '../components/AppIcon';

const FEATURES: { icon: AppIconName; label: string }[] = [
  { icon: 'shield-check', label: 'Secure' },
  { icon: 'cloud-outline', label: 'Remote' },
  { icon: 'bell-outline', label: 'Alerts' },
  { icon: 'view-grid-outline', label: 'Multi View' },
];

export function WelcomeScreen() {
  const { actions } = useNetFocus();

  return (
    <View style={styles.background}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/images/netfocus-logo.png')}
          style={styles.brandArtwork}
          resizeMode="contain"
          accessibilityLabel="NetFocus — empowering you with eyes everywhere"
        />
        <Text style={styles.title}>CCTV Surveillance App</Text>
        <View style={styles.titleRule} />
        <Image
          source={require('../assets/images/welcome-equipment.jpg')}
          style={styles.equipmentArtwork}
          resizeMode="contain"
          accessibilityLabel="NetFocus security cameras and recorder"
        />

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature.label} style={styles.feature}>
              <AppIcon
                name={feature.icon}
                size={27}
                color={colors.royalBlueDark}
                style={styles.featureIcon}
              />
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => actions.navigateTo(AppScreen.Login)}
          accessibilityRole="button"
        >
          <View style={styles.primaryButtonContent}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <AppIcon name="arrow-right" size={22} color={colors.textWhite} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.lightIceBg },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  brandArtwork: { width: '100%', height: 190 },
  title: {
    color: colors.textInkNavy,
    fontSize: 24,
    fontWeight: '800' as const,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  titleRule: { height: 2, width: '42%', backgroundColor: colors.brightSkyCyan, marginTop: spacing.sm },
  equipmentArtwork: { width: '100%', height: 240, marginTop: spacing.md },
  features: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  feature: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: '#B9D7ED' },
  featureIcon: { lineHeight: 34 },
  featureLabel: { color: colors.textInkNavy, fontSize: 13, fontWeight: '700' as const, marginTop: spacing.xs },
  primaryButton: {
    width: '72%',
    backgroundColor: colors.deepBlueCtaStart,
    borderRadius: 28,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
    elevation: 3,
  },
  primaryButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  primaryButtonText: { color: colors.textWhite, fontSize: 20, fontWeight: '800' as const },
});
