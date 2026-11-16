import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  NetFocusBottomNavigation,
  NetFocusHeader,
  SurveillanceBackground,
} from '../components/NetFocusChrome';
import { useNetFocus } from '../state';
import { AppScreen } from '../types';
import { colors, spacing, radii, typography } from '../theme';

export function DevicesListScreen() {
  const { state, derived, actions } = useNetFocus();

  const renderDevice = (deviceId: string) => {
    const device = state.devices.find((d) => d.id === deviceId);
    if (!device) {
      return null;
    }
    return (
      <TouchableOpacity
        key={device.id}
        style={styles.deviceCard}
        activeOpacity={0.85}
        onPress={() => actions.toggleDeviceOnline(device.id)}
      >
        <View style={styles.deviceRow}>
          <View style={[styles.statusDot, device.isOnline ? styles.dotOn : styles.dotOff]} />
          <View style={styles.deviceText}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceMeta}>
              {device.type} • {device.ipAddress}:{device.port}
            </Text>
          </View>
          <Text style={[styles.statusText, device.isOnline ? styles.statusOn : styles.statusOff]}>
            {device.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SurveillanceBackground>
      <View style={styles.devicesContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Devices</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={() => actions.navigateTo(AppScreen.AddDevice)}>
            <Text style={styles.addButtonText}>+ Add Device</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {derived.onlineDeviceCount} online • {derived.offlineDeviceCount} offline • {state.devices.length} total
          </Text>
        </View>

        <View style={styles.list}>{state.devices.map((device) => renderDevice(device.id))}</View>
      </View>
    </SurveillanceBackground>
  );
}

export function SettingsScreen() {
  const { state, actions } = useNetFocus();

  const rows = [
    { key: 'motion', label: 'Motion Alerts', value: state.motionAlertsEnabled, onToggle: actions.toggleMotionAlerts },
    { key: 'autoRecord', label: 'Auto Record Motion', value: state.autoRecordMotion, onToggle: actions.toggleAutoRecordMotion },
    { key: 'hardware', label: 'Hardware Decoding', value: state.hardwareDecoding, onToggle: actions.toggleHardwareDecoding },
    { key: 'audio', label: 'Audio Monitoring', value: state.isAudioEnabled, onToggle: actions.toggleAudio },
    { key: 'talk', label: 'Two-Way Intercom', value: state.isTalkEnabled, onToggle: actions.toggleTalk },
    { key: 'stream', label: 'HD Stream (1080p)', value: state.isStreamHd, onToggle: actions.toggleStreamQuality },
  ];

  return (
    <SurveillanceBackground>
      <View style={styles.container}>
        <NetFocusHeader variant="back" />
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.panel}>
            {rows.map((row) => (
              <TouchableOpacity key={row.key} style={styles.settingRow} activeOpacity={0.85} onPress={row.onToggle}>
                <Text style={styles.settingLabel}>{row.label}</Text>
                <View style={[styles.switch, row.value ? styles.switchOn : null]}>
                  <View style={[styles.switchKnob, row.value ? styles.switchKnobOn : null]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={() => {
              actions.logout();
            }}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <NetFocusBottomNavigation />
      </View>
    </SurveillanceBackground>
  );
}

const styles = StyleSheet.create({
  devicesContainer: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.textWhite, fontSize: 22, fontWeight: '800' as const },
  addButton: { backgroundColor: colors.deepBlueCtaStart, borderRadius: 12, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  addButtonText: { color: colors.textWhite, fontSize: 12, fontWeight: '700' as const },
  summaryRow: { marginTop: spacing.md },
  summaryText: { color: colors.textMutedBlue, fontSize: 12 },
  list: { marginTop: spacing.md },
  deviceCard: {
    backgroundColor: colors.cardNavy,
    borderWidth: 1,
    borderColor: colors.cardBorderCyan,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  dotOn: { backgroundColor: colors.onlineGreen },
  dotOff: { backgroundColor: colors.eventRed },
  deviceText: { flex: 1, marginLeft: spacing.sm },
  deviceName: { color: colors.textWhite, fontSize: 14, fontWeight: '600' as const },
  deviceMeta: { color: colors.textMutedBlue, fontSize: 11, marginTop: spacing.xs },
  statusText: { fontSize: 10, fontWeight: '800' as const },
  statusOn: { color: colors.onlineGreen },
  statusOff: { color: colors.eventRed },
  panel: { backgroundColor: colors.cardNavy, borderWidth: 1, borderColor: colors.cardBorderCyan, borderRadius: radii.lg, padding: spacing.md, marginTop: spacing.lg },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorderCyan },
  settingLabel: { color: colors.textWhite, fontSize: 14, fontWeight: '500' as const },
  switch: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.cardInputBg, borderWidth: 1, borderColor: colors.cardBorderCyan, overflow: 'hidden' },
  switchOn: { backgroundColor: colors.royalBlue },
  switchKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.textMutedBlue, margin: 2 },
  switchKnobOn: { backgroundColor: colors.brightSkyCyan, marginLeft: 22 },
  logoutButton: { marginTop: spacing.xl, backgroundColor: colors.cardNavy, borderWidth: 1, borderColor: colors.cardBorderCyan, borderRadius: radii.md, paddingVertical: spacing.md, alignItems: 'center' },
  logoutButtonText: { color: colors.eventRed, fontSize: 14, fontWeight: '700' as const },
});
