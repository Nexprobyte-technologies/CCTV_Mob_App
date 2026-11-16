import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNetFocus } from '../state';
import { AppScreen } from '../types';
import { colors, spacing } from '../theme';

const FEATURES = [
  { icon: '✓', label: 'Secure' },
  { icon: '☁', label: 'Remote' },
  { icon: '♧', label: 'Alerts' },
  { icon: '▦', label: 'Multi View' },
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
              <Text style={styles.featureIcon}>{feature.icon}</Text>
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
          <Text style={styles.primaryButtonText}>Get Started  →</Text>
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
  featureIcon: { color: colors.royalBlueDark, fontSize: 27, lineHeight: 34, fontWeight: '700' as const },
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
  primaryButtonText: { color: colors.textWhite, fontSize: 20, fontWeight: '800' as const },
});
