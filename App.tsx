import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NetFocusDrawer, SurveillanceBackground } from './src/components/NetFocusChrome';
import { AlertsModalSheet, SnapshotsModalSheet } from './src/components/Modals';
import { NetFocusProvider, useNetFocus } from './src/state';
import { AppScreen } from './src/types';
import { colors, spacing } from './src/theme';
import { AddDeviceScreen } from './src/screens/AddDeviceScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import { DevicesListScreen, SettingsScreen } from './src/screens/DevicesAndSettingsScreens';
import { HomeScreen } from './src/screens/HomeScreen';
import { LiveViewScreen } from './src/screens/LiveViewScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { PlaybackPtzScreen } from './src/screens/PlaybackPtzScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

function NetFocusApp() {
  const { state, actions, drawerOpen, setDrawerOpen } = useNetFocus();
  const [snackVisible, setSnackVisible] = useState(false);

  useEffect(() => {
    if (state.snackbarMessage) {
      setSnackVisible(true);
      const timer = setTimeout(() => {
        actions.clearMessage();
        setSnackVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setSnackVisible(false);
  }, [state.snackbarMessage]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case AppScreen.Welcome:
        return <WelcomeScreen />;
      case AppScreen.Login:
        return <LoginScreen />;
      case AppScreen.CreateAccount:
        return <CreateAccountScreen />;
      case AppScreen.Home:
        return <HomeScreen />;
      case AppScreen.LiveView:
        return <LiveViewScreen />;
      case AppScreen.Playback:
        return <PlaybackPtzScreen />;
      case AppScreen.AddDevice:
        return <AddDeviceScreen />;
      case AppScreen.Devices:
        return <DevicesListScreen />;
      case AppScreen.Settings:
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  const handleNavigate = (screen: AppScreen) => {
    actions.navigateTo(screen);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    actions.logout();
    setDrawerOpen(false);
  };

  const handleDrawerNavigate = (screen: AppScreen) => {
    if (screen === AppScreen.Settings) {
      actions.navigateTo(AppScreen.Settings);
      setDrawerOpen(false);
      return;
    }
    if (screen === AppScreen.AddDevice) {
      actions.navigateTo(AppScreen.AddDevice);
      setDrawerOpen(false);
      return;
    }
    if (screen === AppScreen.Home) {
      actions.navigateTo(AppScreen.Home);
      setDrawerOpen(false);
      return;
    }
    actions.navigateTo(screen);
    setDrawerOpen(false);
  };

  return (
    <View style={styles.container}>
      <SurveillanceBackground>{renderScreen()}</SurveillanceBackground>

      <NetFocusDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
        current={state.currentScreen}
        onLogout={handleLogout}
      />

      {state.showAlertsSheet ? (
        <AlertsModalSheet
          alerts={state.alerts}
          onDismiss={() => actions.setShowAlertsSheet(false)}
          onSelectAlertCamera={(channelId) => {
            actions.selectChannel(channelId);
            actions.openPlayback(false);
          }}
        />
      ) : null}

      {state.showSnapshotsSheet ? (
        <SnapshotsModalSheet
          snapshots={state.snapshots}
          onDismiss={() => actions.setShowSnapshotsSheet(false)}
        />
      ) : null}

      {snackVisible && state.snackbarMessage ? (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{state.snackbarMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.deepNavyBg },
  snackbar: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.cardNavy,
    borderColor: colors.cardBorderCyan,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    zIndex: 100,
  },
  snackbarText: { color: colors.textWhite, fontSize: 13, fontWeight: '600', textAlign: 'center' },
});

export default function App() {
  return (
    <NetFocusProvider>
      <StatusBar barStyle="light-content" />
      <NetFocusApp />
    </NetFocusProvider>
  );
}
