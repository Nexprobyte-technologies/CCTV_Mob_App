import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CameraThumbnail,
  NetFocusBottomNavigation,
  NetFocusHeader,
  SurveillanceBackground,
} from '../components/NetFocusChrome';
import { useNetFocus } from '../state';
import { AppScreen, CameraChannel } from '../types';
import { colors } from '../theme';

const COMPATIBLE_BRANDS = ['HIKVISION', 'CP PLUS', 'TVT', 'ONVIF', 'RTSP'];
const GRID_COUNTS = [1, 4, 9, 16];

export function LiveViewScreen() {
  const { state, actions, derived } = useNetFocus();
  const selectedChannel = derived.selectedChannel;
  const channels =
    state.liveGridCount === 1
      ? state.channels.filter((channel) => channel.id === state.selectedChannelId)
      : state.channels.slice(0, state.liveGridCount);

  const openTab = (screen: AppScreen) => {
    if (screen === AppScreen.Playback) {
      actions.openPlayback(false);
    } else {
      actions.navigateTo(screen);
    }
  };

  const renderChannel = (channel: CameraChannel) => {
    const tileWidth =
      state.liveGridCount === 1 ? '100%' : state.liveGridCount === 4 ? '49%' : state.liveGridCount === 9 ? '32%' : '24%';
    const tileHeight =
      state.liveGridCount === 1 ? 250 : state.liveGridCount === 4 ? 130 : state.liveGridCount === 9 ? 86 : 64;
    return (
      <TouchableOpacity
        key={channel.id}
        style={[styles.cameraTile, { width: tileWidth, height: tileHeight }, !channel.isOnline && styles.tileOffline]}
        activeOpacity={0.85}
        onPress={() => actions.selectChannel(channel.id)}
        onLongPress={actions.toggleLiveFullscreen}
        accessibilityRole="button"
        accessibilityLabel={`Select ${channel.code} ${channel.nameEn}`}
      >
        <CameraThumbnail channelId={channel.id} style={styles.cameraImage} />
        <View style={styles.cameraCaption}>
          <View style={[styles.statusDot, channel.isOnline ? styles.dotOn : styles.dotOff]} />
          <Text style={styles.channelCode}>{channel.code}</Text>
          {channel.isRecording ? <Text style={styles.recBadge}>REC</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  const controls = [
    { key: 'ptz', icon: '✥', title: 'PTZ', onPress: () => actions.openPlayback(true) },
    { key: 'snapshot', icon: '◎', title: 'Snapshot', onPress: actions.captureSnapshot },
    { key: 'record', icon: '▣', title: 'Record', onPress: actions.toggleRecordingActiveChannel },
    { key: 'audio', icon: '◖', title: state.isAudioEnabled ? 'Audio On' : 'Audio', onPress: actions.toggleAudio },
    { key: 'talk', icon: '♩', title: state.isTalkEnabled ? 'Talk On' : 'Talk', onPress: actions.toggleTalk },
    { key: 'quality', icon: 'HD', title: 'SD/HD', onPress: actions.toggleStreamQuality },
  ];

  return (
    <SurveillanceBackground>
      <View style={styles.screen}>
        <NetFocusHeader />
        <View style={styles.topTabs}>
          {[
            { key: 'live', icon: '▣', label: 'Live View', screen: AppScreen.LiveView },
            { key: 'playback', icon: '▷', label: 'Playback', screen: AppScreen.Playback },
            { key: 'devices', icon: '▰', label: 'Devices', screen: AppScreen.Devices },
            { key: 'settings', icon: '⚙', label: 'Settings', screen: AppScreen.Settings },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.topTab, tab.key === 'live' && styles.topTabActive]}
              activeOpacity={0.8}
              onPress={() => openTab(tab.screen)}
            >
              <Text style={styles.topTabIcon}>{tab.icon}</Text>
              <Text style={styles.topTabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.compatibility}>
            <Text style={styles.compatibilityTitle}>Compatible With:</Text>
            <View style={styles.brandList}>
              {COMPATIBLE_BRANDS.map((brand) => (
                <View key={brand} style={styles.brandBadge}>
                  <Text style={styles.brandText}>{brand}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Live View</Text>
            <View style={styles.onlineLabel}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online ({state.channels.filter((channel) => channel.isOnline).length})</Text>
            </View>
            <TouchableOpacity onPress={actions.toggleLiveFullscreen} accessibilityLabel="Toggle fullscreen">
              <Text style={styles.fullscreenIcon}>{state.isLiveFullscreen ? '⊡' : '⛶'}</Text>
            </TouchableOpacity>
          </View>

          {state.isLiveFullscreen && selectedChannel ? (
            <TouchableOpacity
              style={styles.fullscreenFeed}
              activeOpacity={0.9}
              onPress={actions.toggleLiveFullscreen}
            >
              <CameraThumbnail channelId={selectedChannel.id} style={styles.fullscreenImage} />
              <View style={styles.fullscreenCaption}>
                <Text style={styles.fullscreenName}>{selectedChannel.code} · {selectedChannel.nameEn}</Text>
                <Text style={styles.fullscreenStatus}>● LIVE</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.cameraGrid}>{channels.map(renderChannel)}</View>
          )}

          <View style={styles.gridSelector}>
            {GRID_COUNTS.map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.gridOption, state.liveGridCount === count && styles.gridOptionActive]}
                activeOpacity={0.8}
                onPress={() => actions.setLiveGridCount(count)}
              >
                <Text style={styles.gridOptionIcon}>{count === 1 ? '□' : count === 4 ? '▦' : count === 9 ? '▦' : '▦'}</Text>
                <View>
                  <Text style={styles.gridOptionValue}>{count === 1 ? '' : count}</Text>
                  <Text style={styles.gridOptionLabel}>{count === 1 ? 'Single Camera' : `${count} Cameras`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.controlBar}>
            {controls.map((control) => (
              <TouchableOpacity key={control.key} style={styles.control} activeOpacity={0.8} onPress={control.onPress}>
                <Text style={styles.controlIcon}>{control.icon}</Text>
                <Text style={styles.controlTitle}>{control.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.connectionBar} onPress={() => actions.navigateTo(AppScreen.Devices)}>
            <Text style={styles.connectionCheck}>✓</Text>
            <Text style={styles.connectionItem}>Device : {state.devices[0]?.name ?? 'NetFocus NVR'}</Text>
            <Text style={styles.connectionItem}>Channels : {state.channels.length} / {state.channels.length}</Text>
            <Text style={styles.connectionStatus}>Connected</Text>
          </TouchableOpacity>
        </ScrollView>

        <NetFocusBottomNavigation />
      </View>
    </SurveillanceBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.deepNavyBg },
  topTabs: {
    minHeight: 66,
    flexDirection: 'row',
    marginHorizontal: 7,
    marginTop: 4,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#245981',
    backgroundColor: '#0a294c',
  },
  topTab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5, borderRightWidth: 1, borderColor: '#315b7d' },
  topTabActive: { backgroundColor: '#0879d3', borderRadius: 17 },
  topTabIcon: { color: colors.textWhite, fontSize: 20, lineHeight: 24 },
  topTabLabel: { color: colors.textWhite, fontSize: 10, lineHeight: 13, fontWeight: '700' as const },
  scroll: { flex: 1 },
  content: { padding: 8, paddingBottom: 10 },
  compatibility: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dceefe',
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  compatibilityTitle: { color: '#061a34', fontSize: 9, fontWeight: '800' as const },
  brandList: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', gap: 3, marginLeft: 5 },
  brandBadge: { backgroundColor: colors.textWhite, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 4 },
  brandText: { color: '#12356c', fontSize: 8, fontWeight: '900' as const },
  sectionHeading: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  sectionTitle: { flex: 1, color: colors.textWhite, fontSize: 15, fontWeight: '800' as const },
  onlineLabel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.onlineGreenBright },
  onlineText: { color: colors.textWhite, fontSize: 10, fontWeight: '700' as const },
  fullscreenIcon: { color: colors.textWhite, fontSize: 23, lineHeight: 28 },
  cameraGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 5 },
  cameraTile: { aspectRatio: 1.48, overflow: 'hidden', borderRadius: 8, borderWidth: 1, borderColor: '#8bb8d1', marginBottom: 1 },
  tileOffline: { opacity: 0.55 },
  cameraImage: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  cameraCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: 'rgba(2, 14, 33, 0.76)',
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  dotOn: { backgroundColor: colors.onlineGreenBright },
  dotOff: { backgroundColor: colors.eventRed },
  channelCode: { color: colors.textWhite, fontSize: 9, fontWeight: '800' as const, flex: 1 },
  recBadge: { color: '#ff5964', fontSize: 8, fontWeight: '900' as const },
  fullscreenFeed: { height: 250, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#75a9cc' },
  fullscreenImage: { width: '100%', height: '100%' },
  fullscreenCaption: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.65)', flexDirection: 'row', justifyContent: 'space-between' },
  fullscreenName: { color: colors.textWhite, fontWeight: '700' as const },
  fullscreenStatus: { color: colors.onlineGreenBright, fontSize: 11, fontWeight: '800' as const },
  gridSelector: {
    minHeight: 56,
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3e729c',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0a2b50',
  },
  gridOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderRightWidth: 1, borderColor: '#315b7d' },
  gridOptionActive: { backgroundColor: '#087cdd' },
  gridOptionIcon: { color: colors.textWhite, fontSize: 23, lineHeight: 27 },
  gridOptionValue: { color: colors.textWhite, fontSize: 16, lineHeight: 18, fontWeight: '800' as const },
  gridOptionLabel: { color: colors.textWhite, fontSize: 8, lineHeight: 11 },
  controlBar: {
    minHeight: 72,
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3e729c',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#08264a',
  },
  control: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5, borderRightWidth: 1, borderColor: '#315b7d' },
  controlIcon: { color: colors.textWhite, fontSize: 21, lineHeight: 24, fontWeight: '700' as const },
  controlTitle: { color: colors.textWhite, fontSize: 9, lineHeight: 12, fontWeight: '700' as const, textAlign: 'center' },
  connectionBar: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 7,
    backgroundColor: '#08264a',
    borderWidth: 1,
    borderColor: '#3e729c',
    borderRadius: 10,
  },
  connectionCheck: { color: colors.textWhite, backgroundColor: colors.onlineGreen, width: 18, height: 18, borderRadius: 9, textAlign: 'center', overflow: 'hidden', fontWeight: '900' as const, fontSize: 13 },
  connectionItem: { color: colors.textWhite, fontSize: 8, fontWeight: '600' as const },
  connectionStatus: { color: colors.onlineGreenBright, fontSize: 9, fontWeight: '800' as const },
});
