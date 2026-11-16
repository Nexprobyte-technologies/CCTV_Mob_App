import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NetFocusBottomNavigation, NetFocusHeader, SurveillanceBackground } from '../components/NetFocusChrome';
import { useNetFocus } from '../state';
import { AppScreen } from '../types';
import { colors } from '../theme';
import { AppIcon, AppIconName } from '../components/AppIcon';

export function HomeScreen() {
  const { derived, actions } = useNetFocus();

  const shortcuts: { key: string; icon: AppIconName; title: string; onPress: () => void }[] = [
    { key: 'live', icon: 'cctv', title: 'Live View', onPress: () => actions.navigateTo(AppScreen.LiveView) },
    { key: 'devices', icon: 'server-network', title: 'Devices', onPress: () => actions.navigateTo(AppScreen.Devices) },
    { key: 'playback', icon: 'play-box-multiple-outline', title: 'Playback', onPress: () => actions.openPlayback(false) },
    { key: 'ptz', icon: 'crosshairs-gps', title: 'PTZ Control', onPress: () => actions.openPlayback(true) },
    { key: 'snapshot', icon: 'camera-plus-outline', title: 'Snapshot', onPress: () => actions.setShowSnapshotsSheet(true) },
    { key: 'settings', icon: 'account-cog-outline', title: 'Settings', onPress: () => actions.navigateTo(AppScreen.Settings) },
  ];

  const deviceStats: { icon: AppIconName; value: number; title: string; tint?: string }[] = [
    { icon: 'check-circle-outline', value: derived.onlineDeviceCount, title: 'Online', tint: colors.onlineGreenBright },
    { icon: 'alert-circle-outline', value: derived.offlineDeviceCount, title: 'Offline', tint: colors.eventRed },
    { icon: 'server-network', value: derived.nvrDvrCount, title: 'NVR/DVR' },
    { icon: 'cctv', value: derived.ipCameraCount, title: 'IP Camera' },
  ];

  return (
    <SurveillanceBackground>
      <View style={styles.screen}>
        <NetFocusHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../assets/images/home-hero.jpg')}
            style={styles.hero}
            resizeMode="cover"
            accessibilityLabel="NetFocus CCTV solution"
          />

          <View style={styles.shortcutGrid}>
            {shortcuts.map((shortcut, index) => (
              <TouchableOpacity
                key={shortcut.key}
                style={[styles.shortcut, index === 0 && styles.shortcutPrimary]}
                activeOpacity={0.82}
                onPress={shortcut.onPress}
                accessibilityRole="button"
              >
                <AppIcon
                  name={shortcut.icon}
                  size={33}
                  color={colors.textWhite}
                  style={styles.shortcutIcon}
                />
                <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.statusCard}
            activeOpacity={0.85}
            onPress={() => actions.navigateTo(AppScreen.Devices)}
          >
            <View style={styles.statusHeading}>
              <View style={styles.statusCheck}>
                <AppIcon name="check" size={17} color={colors.textWhite} />
              </View>
              <Text style={styles.statusHeadingText}>Device Status</Text>
              <AppIcon name="chevron-right" size={24} color={colors.textWhite} style={styles.statusChevron} />
            </View>
            <View style={styles.statsRow}>
              {deviceStats.map((item, index) => (
                <View key={item.title} style={[styles.stat, index > 0 && styles.statDivider]}>
                  <AppIcon
                    name={item.icon}
                    size={23}
                    color={item.tint ?? colors.textWhite}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statTitle}>{item.title}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </ScrollView>
        <NetFocusBottomNavigation />
      </View>
    </SurveillanceBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.deepNavyBg },
  scroll: { flex: 1 },
  content: { padding: 10, paddingBottom: 12 },
  hero: { width: '100%', height: 118, borderRadius: 16, marginBottom: 12 },
  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 12 },
  shortcut: {
    width: '31.6%',
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A2A50',
    borderWidth: 1,
    borderColor: '#174c7b',
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  shortcutPrimary: { backgroundColor: '#0879d3', borderColor: '#18aef5' },
  shortcutIcon: { lineHeight: 42 },
  shortcutTitle: { color: colors.textWhite, fontSize: 14, lineHeight: 18, fontWeight: '800' as const, textAlign: 'center' },
  statusCard: {
    overflow: 'hidden',
    backgroundColor: '#08264b',
    borderWidth: 1,
    borderColor: '#1e5c90',
    borderRadius: 18,
  },
  statusHeading: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#0b3766',
    borderBottomWidth: 1,
    borderColor: '#1e5c90',
  },
  statusCheck: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.onlineGreen, alignItems: 'center', justifyContent: 'center' },
  statusHeadingText: { flex: 1, color: colors.textWhite, fontSize: 14, fontWeight: '800' as const, marginLeft: 9 },
  statusChevron: { lineHeight: 30 },
  statsRow: { flexDirection: 'row', minHeight: 110, paddingVertical: 10 },
  stat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  statDivider: { borderLeftWidth: 1, borderColor: '#28557e' },
  statIcon: { lineHeight: 26 },
  statValue: { color: colors.textWhite, fontSize: 23, lineHeight: 27, fontWeight: '800' as const },
  statTitle: { color: colors.textWhite, fontSize: 11, lineHeight: 15, fontWeight: '700' as const, textAlign: 'center' },
});
