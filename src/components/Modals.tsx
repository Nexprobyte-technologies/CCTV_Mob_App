import React, { useEffect, useRef } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { AlertItem, SnapshotItem } from '../types';
import { cameraSceneLabels } from '../types';

interface AlertsModalSheetProps {
  alerts: AlertItem[];
  onDismiss: () => void;
  onSelectAlertCamera: (channelId: number) => void;
}

export function AlertsModalSheet({ alerts, onDismiss, onSelectAlertCamera }: AlertsModalSheetProps) {
  const slideAnim = useRef(new Animated.Value(420)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 260, useNativeDriver: true }).start();
  }, [slideAnim]);

  const handleSelect = (alert: AlertItem) => {
    const parsed = Number.parseInt(alert.cameraCode.replace(/\D/g, ''), 10);
    const channelId = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    onSelectAlertCamera(channelId);
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Alerts</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.sheetBody} contentContainerStyle={styles.sheetContent}>
            {alerts.length === 0 ? (
              <Text style={styles.emptyText}>No alerts recorded</Text>
            ) : (
              alerts.map((alert) => (
                <TouchableOpacity key={alert.id} style={styles.alertRow} activeOpacity={0.8} onPress={() => handleSelect(alert)}>
                  <View style={styles.alertRowMain}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMeta}>
                      {alert.cameraCode} • {alert.time}
                    </Text>
                  </View>
                  {alert.isUrgent ? <Text style={styles.urgentBadge}>URGENT</Text> : null}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

interface SnapshotsModalSheetProps {
  snapshots: SnapshotItem[];
  onDismiss: () => void;
}

export function SnapshotsModalSheet({ snapshots, onDismiss }: SnapshotsModalSheetProps) {
  const slideAnim = useRef(new Animated.Value(420)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 260, useNativeDriver: true }).start();
  }, [slideAnim]);

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Snapshots</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.sheetBody} contentContainerStyle={styles.sheetContent}>
            {snapshots.length === 0 ? (
              <Text style={styles.emptyText}>No snapshots yet</Text>
            ) : (
              snapshots.map((snapshot) => (
                <TouchableOpacity key={snapshot.id} style={styles.alertRow} activeOpacity={0.8} onPress={onDismiss}>
                  <View style={styles.alertRowMain}>
                    <Text style={styles.alertTitle}>{snapshot.cameraName}</Text>
                    <Text style={styles.alertMeta}>
                      {snapshot.cameraCode} • {snapshot.timestamp}
                    </Text>
                  </View>
                  <Text style={[styles.sceneBadge, styles.sceneBadgeText]}>{cameraSceneLabels[snapshot.sceneType]}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2, 8, 23, 0.7)' },
  backdrop: { ...StyleSheet.absoluteFillObject, flex: 1 },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardNavy,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorderCyan,
    maxHeight: '78%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  sheetTitle: { color: colors.textWhite, fontSize: 17, fontWeight: '700' as const },
  closeButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  closeText: { color: colors.textMutedBlue, fontSize: 13, fontWeight: '600' as const },
  sheetBody: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  sheetContent: { paddingBottom: spacing.md },
  emptyText: { color: colors.textMutedBlue, fontSize: 13, textAlign: 'center', paddingVertical: spacing.xl },
  alertRow: {
    backgroundColor: colors.cardInputBg,
    borderWidth: 1,
    borderColor: colors.cardBorderCyan,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertRowMain: { flex: 1 },
  alertTitle: { color: colors.textWhite, fontSize: 13, fontWeight: '600' as const },
  alertMeta: { color: colors.textMutedBlue, fontSize: 11, marginTop: spacing.xs },
  urgentBadge: {
    backgroundColor: colors.eventRed,
    color: colors.textWhite,
    fontSize: 9,
    fontWeight: '800' as const,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  sceneBadge: {
    backgroundColor: colors.royalBlueDark,
    borderRadius: radii.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sceneBadgeText: { color: colors.brightSkyCyan, fontSize: 10, fontWeight: '700' as const },
});
