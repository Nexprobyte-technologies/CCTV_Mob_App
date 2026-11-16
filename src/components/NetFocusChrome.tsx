import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing } from '../theme';
import { AppScreen } from '../types';
import { NetFocusArtwork } from './NetFocusArtwork';
import { useNetFocus } from '../state';

interface SurveillanceBackgroundProps {
  children?: React.ReactNode;
}

export function SurveillanceBackground({ children }: SurveillanceBackgroundProps) {
  return <View style={styles.background}>{children}</View>;
}

export function NetFocusHeader({ variant = 'main' }: { variant?: 'main' | 'back' }) {
  const { actions, setDrawerOpen } = useNetFocus();

  return (
    <View style={chromeStyles.header}>
      <TouchableOpacity
        style={chromeStyles.headerAction}
        activeOpacity={0.75}
        onPress={variant === 'main' ? () => setDrawerOpen(true) : actions.navigateBack}
        accessibilityLabel={variant === 'main' ? 'Open menu' : 'Go back'}
      >
        <Text style={chromeStyles.headerActionText}>{variant === 'main' ? '☰' : '‹'}</Text>
      </TouchableOpacity>
      <View style={chromeStyles.wordmark}>
        <Image
          source={require('../assets/images/netfocus-logo.png')}
          style={chromeStyles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="NetFocus logo"
        />
      </View>
      <TouchableOpacity
        style={chromeStyles.headerAction}
        activeOpacity={0.75}
        onPress={
          variant === 'main'
            ? () => actions.setShowAlertsSheet(true)
            : () => actions.showMessage('More options')
        }
        accessibilityLabel={variant === 'main' ? 'Show alerts' : 'More options'}
      >
        <Text style={chromeStyles.headerActionText}>{variant === 'main' ? '♧' : '⋮'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const bottomTabs = [
  { key: 'home', screen: AppScreen.Home, icon: '⌂', en: 'Home' },
  { key: 'live', screen: AppScreen.LiveView, icon: '▦', en: 'Live' },
  { key: 'playback', screen: AppScreen.Playback, icon: '▷', en: 'Playback' },
  { key: 'ptz', screen: AppScreen.Playback, icon: '✥', en: 'PTZ', ptz: true },
  { key: 'settings', screen: AppScreen.Settings, icon: '♙', en: 'Me' },
];

export function NetFocusBottomNavigation() {
  const { state, actions } = useNetFocus();

  const activeKey =
    state.currentScreen === AppScreen.Home
      ? 'home'
      : state.currentScreen === AppScreen.LiveView
        ? 'live'
        : state.currentScreen === AppScreen.Playback
          ? state.playbackTabIsPtz ? 'ptz' : 'playback'
          : state.currentScreen === AppScreen.Settings || state.currentScreen === AppScreen.Devices
            ? 'settings'
            : '';

  return (
    <View style={chromeStyles.bottomBar}>
      {bottomTabs.map((tab) => {
        const active = activeKey === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[chromeStyles.bottomTab, active && chromeStyles.bottomTabActive]}
            activeOpacity={0.8}
            onPress={() => {
              if (tab.ptz) {
                actions.setPlaybackTab(true);
              } else if (tab.screen === AppScreen.Playback) {
                actions.setPlaybackTab(false);
              }
              actions.navigateTo(tab.screen);
            }}
            accessibilityRole="button"
          >
            <Text style={[chromeStyles.bottomIcon, active && chromeStyles.bottomIconActive]}>{tab.icon}</Text>
            <Text style={[chromeStyles.bottomLabel, active && chromeStyles.bottomLabelActive]}>{tab.en}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const cameraImages = [
  require('../assets/images/camera-01.jpg'),
  require('../assets/images/camera-02.jpg'),
  require('../assets/images/camera-03.jpg'),
  require('../assets/images/camera-04.jpg'),
  require('../assets/images/camera-05.jpg'),
  require('../assets/images/camera-06.jpg'),
  require('../assets/images/camera-07.jpg'),
  require('../assets/images/camera-08.jpg'),
  require('../assets/images/camera-09.jpg'),
  require('../assets/images/camera-10.jpg'),
  require('../assets/images/camera-11.jpg'),
  require('../assets/images/camera-12.jpg'),
  require('../assets/images/camera-13.jpg'),
  require('../assets/images/camera-14.jpg'),
  require('../assets/images/camera-15.jpg'),
  require('../assets/images/camera-16.jpg'),
];

export function CameraThumbnail({ channelId, style }: { channelId: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={cameraImages[(channelId - 1) % cameraImages.length]}
      style={style}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.deepNavyBg },
  overlay: { ...StyleSheet.absoluteFillObject, flex: 1, zIndex: 200 },
  overlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 8, 23, 0.65)' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.cardNavy,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorderCyan,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  headerText: { flex: 1 },
  headerTitle: { color: colors.textWhite, fontSize: 18, fontWeight: '700' as const },
  headerSubtitle: { color: colors.textMutedBlue, fontSize: 12, marginTop: spacing.xs },
  navList: { flex: 1 },
  navItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  navItemActive: { backgroundColor: colors.royalBlueDark },
  navItemText: { color: colors.textIceBlue, fontSize: 14, fontWeight: '600' as const },
  navItemTextActive: { color: colors.brightSkyCyan },
  footer: { marginTop: spacing.xl },
  logoutButton: {
    backgroundColor: colors.cardInputBg,
    borderWidth: 1,
    borderColor: colors.cardBorderCyan,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  logoutText: { color: colors.eventRed, fontSize: 13, fontWeight: '700' as const },
});

interface NetFocusDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
  current: AppScreen;
  onLogout: () => void;
}

const NAV_ITEMS: { screen: AppScreen; label: string }[] = [
  { screen: AppScreen.Home, label: 'Home' },
  { screen: AppScreen.LiveView, label: 'Live View' },
  { screen: AppScreen.Playback, label: 'Playback' },
  { screen: AppScreen.Devices, label: 'Devices' },
  { screen: AppScreen.Settings, label: 'Settings' },
];

export function NetFocusDrawer({ open, onClose, onNavigate, current, onLogout }: NetFocusDrawerProps) {
  const { width } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(-spacing.drawerWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacityAnim, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -spacing.drawerWidth,
        duration: 220,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacityAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  }, [open, slideAnim, opacityAnim]);

  const renderNavItem = (screen: AppScreen, label: string) => {
    const isActive = screen === current;
    return (
      <TouchableOpacity
        key={String(screen)}
        style={[styles.navItem, isActive ? styles.navItemActive : null]}
        activeOpacity={0.8}
        onPress={() => {
          onNavigate(screen);
          onClose();
        }}
      >
        <Text style={[styles.navItemText, isActive ? styles.navItemTextActive : null]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.overlayBg, { opacity: opacityAnim }]} />
      <Animated.View
        style={[styles.panel, { width: Math.min(width * 0.82, spacing.drawerWidth), transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.header}>
          <NetFocusArtwork size={44} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Security</Text>
            <Text style={styles.headerSubtitle}>Surveillance Console</Text>
          </View>
        </View>
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => renderNavItem(item.screen, item.label))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={onLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const chromeStyles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#031630',
    borderBottomWidth: 1,
    borderBottomColor: '#164b7b',
  },
  headerAction: { width: 42, height: 46, alignItems: 'center', justifyContent: 'center' },
  headerActionText: { color: colors.textWhite, fontSize: 28, lineHeight: 34 },
  wordmark: { width: 152, height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8e8e8', borderRadius: 5, overflow: 'hidden' },
  brandLogo: { width: '100%', height: '100%' },
  bottomBar: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#061b39',
    borderTopWidth: 1,
    borderColor: '#285e8c',
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 3,
  },
  bottomTabActive: { backgroundColor: '#12a8f4' },
  bottomIcon: { color: colors.textWhite, fontSize: 24, lineHeight: 28 },
  bottomIconActive: { color: '#061b39' },
  bottomLabel: { color: colors.textWhite, fontSize: 11, lineHeight: 14, fontWeight: '700' as const },
  bottomLabelActive: { color: '#041b3a' },
});
