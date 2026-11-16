import React, { useState } from 'react';
import {
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraThumbnail,
  NetFocusBottomNavigation,
  NetFocusHeader,
  SurveillanceBackground,
} from '../components/NetFocusChrome';
import { formatTimelineTime, useNetFocus } from '../state';
import { colors } from '../theme';
import { AppIcon, AppIconName } from '../components/AppIcon';

export function PlaybackPtzScreen() {
  const { state, actions, derived } = useNetFocus();
  const [timelineWidth, setTimelineWidth] = useState(0);
  const channel = derived.selectedChannel;

  const moveTimeline = (event: GestureResponderEvent) => {
    if (timelineWidth > 0) {
      actions.setTimelinePosition(event.nativeEvent.locationX / timelineWidth);
    }
  };

  const changeCamera = () => {
    const channelCount = state.channels.length;
    const currentIndex = state.channels.findIndex((item) => item.id === state.selectedChannelId);
    const nextChannel = state.channels[(currentIndex + 1 + channelCount) % channelCount];
    if (nextChannel) {
      actions.selectChannel(nextChannel.id);
    }
  };

  const renderPtzButton = (icon: AppIconName, label: string, onPress: () => void, emphasis = false) => (
    <TouchableOpacity
      style={[styles.ptzButton, emphasis && styles.ptzButtonEmphasis]}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <AppIcon
        name={icon}
        size={19}
        color={emphasis ? '#062243' : colors.textWhite}
        style={styles.ptzButtonIcon}
      />
      <Text style={[styles.ptzButtonLabel, emphasis && styles.ptzButtonLabelEmphasis]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SurveillanceBackground>
      <View style={styles.screen}>
        <NetFocusHeader variant="back" />

        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, !state.playbackTabIsPtz && styles.modeTabActive]}
            onPress={() => actions.setPlaybackTab(false)}
            activeOpacity={0.85}
          >
            <AppIcon name="play-box-multiple-outline" size={17} color={colors.textWhite} style={styles.modeTabIcon} />
            <Text style={[styles.modeTabText, !state.playbackTabIsPtz && styles.modeTabTextActive]}>Playback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, state.playbackTabIsPtz && styles.modeTabActive]}
            onPress={() => actions.setPlaybackTab(true)}
            activeOpacity={0.85}
          >
            <AppIcon name="crosshairs-gps" size={17} color={colors.textWhite} style={styles.modeTabIcon} />
            <Text style={[styles.modeTabText, state.playbackTabIsPtz && styles.modeTabTextActive]}>PTZ Control</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.preview}>
            {channel ? <CameraThumbnail channelId={channel.id} style={styles.previewImage} /> : null}
            <View style={styles.previewShade} />
            <View style={styles.previewTop}>
              <View style={styles.recordingBadge}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>PLAYBACK</Text>
              </View>
              <Text style={styles.previewTimestamp}>
                {state.selectedDate}  {formatTimelineTime(state.timelinePosition)}
              </Text>
            </View>
            <View style={styles.previewBottom}>
              <Text style={styles.previewChannel}>{channel?.code ?? 'CH 01'}  ·  {channel?.nameEn ?? 'Camera'}</Text>
              <TouchableOpacity onPress={changeCamera} style={styles.changeCameraButton} activeOpacity={0.8}>
                <View style={styles.changeCameraLabel}>
                  <Text style={styles.changeCameraText}>CHANGE CAMERA</Text>
                  <AppIcon name="chevron-right" size={14} color="#062446" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {!state.playbackTabIsPtz ? (
            <>
              <View style={styles.datePanel}>
                <View style={styles.panelTitleRow}>
                  <AppIcon name="calendar-clock" size={16} color={colors.textWhite} />
                  <Text style={styles.panelTitle}>SELECT DATE &amp; TIME</Text>
                </View>
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputCaption}>DATE</Text>
                    <TextInput
                      style={styles.dateInput}
                      value={state.selectedDate}
                      onChangeText={actions.selectDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textMutedBlue}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.inputCaption}>FROM</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={state.selectedStartTime}
                      onChangeText={(value) => actions.selectTimeWindow(value, state.selectedEndTime)}
                      placeholder="09:00 AM"
                      placeholderTextColor={colors.textMutedBlue}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>–</Text>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.inputCaption}>TO</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={state.selectedEndTime}
                      onChangeText={(value) => actions.selectTimeWindow(state.selectedStartTime, value)}
                      placeholder="11:00 AM"
                      placeholderTextColor={colors.textMutedBlue}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.timelinePanel}>
                <View style={styles.timelineHeader}>
                  <View style={styles.panelTitleRow}>
                    <AppIcon name="timeline-clock-outline" size={16} color={colors.textWhite} />
                    <Text style={styles.panelTitle}>RECORDING TIMELINE</Text>
                  </View>
                  <Text style={styles.timelineDate}>{state.selectedDate}</Text>
                </View>
                <View style={styles.timelineLabels}>
                  <Text style={styles.timelineLabel}>09:00</Text>
                  <Text style={styles.timelineLabel}>09:30</Text>
                  <Text style={styles.timelineLabel}>10:00</Text>
                  <Text style={styles.timelineLabel}>10:30</Text>
                  <Text style={styles.timelineLabel}>11:00</Text>
                </View>
                <View
                  style={styles.timelineTrack}
                  onLayout={(event) => setTimelineWidth(event.nativeEvent.layout.width)}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={moveTimeline}
                  onResponderMove={moveTimeline}
                >
                  {state.timelineSegments.map((segment, index) => (
                    <View
                      key={`${segment.startFraction}-${index}`}
                      style={[
                        styles.timelineSegment,
                        {
                          left: `${segment.startFraction * 100}%`,
                          width: `${(segment.endFraction - segment.startFraction) * 100}%`,
                        },
                        segment.isEvent ? styles.timelineEvent : styles.timelineNormal,
                      ]}
                    />
                  ))}
                  {[0.25, 0.5, 0.75].map((position) => (
                    <View key={position} style={[styles.timelineTick, { left: `${position * 100}%` }]} />
                  ))}
                  <View style={[styles.timelinePlayhead, { left: `${state.timelinePosition * 100}%` }]}>
                    <View style={styles.playheadHandle} />
                  </View>
                </View>
                <View style={styles.timelineLegend}>
                  <View style={styles.legendItem}><View style={styles.legendNormal} /><Text style={styles.legendText}>Continuous</Text></View>
                  <View style={styles.legendItem}><View style={styles.legendEvent} /><Text style={styles.legendText}>Motion event</Text></View>
                  <Text style={styles.currentTime}>{formatTimelineTime(state.timelinePosition)}</Text>
                </View>
              </View>

              <View style={styles.playbackControls}>
                <TouchableOpacity style={styles.controlButton} onPress={() => actions.skipSeconds(-30)} activeOpacity={0.75}>
                  <AppIcon name="rewind-30" size={20} color={colors.textWhite} style={styles.controlIcon} />
                  <Text style={styles.controlCaption}>-30s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => actions.skipSeconds(-10)} activeOpacity={0.75}>
                  <AppIcon name="rewind-10" size={17} color={colors.textWhite} style={styles.controlIconSmall} />
                  <Text style={styles.controlCaption}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.playButton} onPress={actions.togglePlayPause} activeOpacity={0.8}>
                  <AppIcon name={state.isPlayingPlayback ? 'pause' : 'play'} size={18} color="#062243" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => actions.skipSeconds(10)} activeOpacity={0.75}>
                  <AppIcon name="fast-forward-10" size={17} color={colors.textWhite} style={styles.controlIconSmall} />
                  <Text style={styles.controlCaption}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => actions.skipSeconds(30)} activeOpacity={0.75}>
                  <AppIcon name="fast-forward-30" size={20} color={colors.textWhite} style={styles.controlIcon} />
                  <Text style={styles.controlCaption}>+30s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.speedButton} onPress={actions.cyclePlaybackSpeed} activeOpacity={0.75}>
                  <Text style={styles.speedText}>{state.playbackSpeed}</Text>
                  <Text style={styles.controlCaption}>Speed</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={actions.captureSnapshot} activeOpacity={0.8}>
                  <AppIcon name="camera-outline" size={16} color={colors.brightSkyCyan} />
                  <Text style={styles.actionText}>Snapshot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={actions.savePlaybackClip} activeOpacity={0.8}>
                  <AppIcon name="download" size={16} color={colors.brightSkyCyan} />
                  <Text style={styles.actionText}>Save Clip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => actions.showMessage('Playback recording is ready')} activeOpacity={0.8}>
                  <AppIcon name="share-variant-outline" size={16} color={colors.brightSkyCyan} />
                  <Text style={styles.actionText}>Export</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.ptzPanel}>
              <View style={styles.timelineHeader}>
                <View>
                  <View style={styles.panelTitleRow}>
                    <AppIcon name="crosshairs-gps" size={16} color={colors.textWhite} />
                    <Text style={styles.panelTitle}>PTZ CONTROL</Text>
                  </View>
                  <Text style={styles.ptzSubtitle}>Pan · Tilt · Zoom · Focus · Iris</Text>
                </View>
                <TouchableOpacity style={styles.resetButton} onPress={actions.resetPtz} activeOpacity={0.75}>
                  <Text style={styles.resetButtonText}>RESET</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ptzBody}>
                <View style={styles.joystick}>
                  <View style={styles.joystickRow}>
                    <View style={styles.joystickEmpty} />
                    {renderPtzButton('arrow-up', 'Tilt up', () => actions.panPtz(0, -0.15))}
                    <View style={styles.joystickEmpty} />
                  </View>
                  <View style={styles.joystickRow}>
                    {renderPtzButton('arrow-left', 'Pan left', () => actions.panPtz(-0.15, 0))}
                    {renderPtzButton('crosshairs-gps', 'Center camera', actions.resetPtz, true)}
                    {renderPtzButton('arrow-right', 'Pan right', () => actions.panPtz(0.15, 0))}
                  </View>
                  <View style={styles.joystickRow}>
                    <View style={styles.joystickEmpty} />
                    {renderPtzButton('arrow-down', 'Tilt down', () => actions.panPtz(0, 0.15))}
                    <View style={styles.joystickEmpty} />
                  </View>
                </View>
                <View style={styles.ptzAdjustments}>
                  {renderPtzButton('plus', 'Zoom in', () => actions.zoomPtz(0.1))}
                  {renderPtzButton('minus', 'Zoom out', () => actions.zoomPtz(-0.1))}
                  {renderPtzButton('focus-field', 'Focus', actions.stepFocus)}
                  {renderPtzButton('circle-slice-8', 'Iris', actions.stepIris)}
                </View>
              </View>

              <View style={styles.ptzReadouts}>
                <Text style={styles.readout}>ZOOM  {state.ptzZoom.toFixed(1)}x</Text>
                <Text style={styles.readout}>FOCUS  {state.ptzFocusLevel}%</Text>
                <Text style={styles.readout}>IRIS  {state.ptzIrisLevel}%</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={actions.captureSnapshot} activeOpacity={0.8}>
                  <AppIcon name="camera-outline" size={16} color={colors.brightSkyCyan} />
                  <Text style={styles.actionText}>Snapshot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={actions.toggleRecordingActiveChannel} activeOpacity={0.8}>
                  <AppIcon name="record-circle-outline" size={16} color={colors.brightSkyCyan} />
                  <Text style={styles.actionText}>Record</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <NetFocusBottomNavigation />
      </View>
    </SurveillanceBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.deepNavyBg },
  modeTabs: { flexDirection: 'row', paddingHorizontal: 13, paddingTop: 10, paddingBottom: 8, gap: 9, backgroundColor: '#061a36' },
  modeTab: { flex: 1, height: 39, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0a294c', borderWidth: 1, borderColor: '#527b9f', borderRadius: 11 },
  modeTabActive: { backgroundColor: '#09b8e9', borderColor: '#30ddff' },
  modeTabIcon: { lineHeight: 24 },
  modeTabText: { color: colors.textWhite, fontSize: 13, fontWeight: '700' as const },
  modeTabTextActive: { color: '#062244' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 11, paddingTop: 8, paddingBottom: 14 },
  preview: { height: 184, overflow: 'hidden', backgroundColor: '#071a2c', borderWidth: 1, borderColor: '#3180ae', borderRadius: 15 },
  previewImage: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  previewShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 10, 23, 0.24)' },
  previewTop: { position: 'absolute', left: 10, right: 10, top: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recordingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(3, 17, 38, 0.82)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  recordingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#f14d57' },
  recordingText: { color: colors.textWhite, fontSize: 9, fontWeight: '900' as const, letterSpacing: 0.5 },
  previewTimestamp: { color: colors.textWhite, backgroundColor: 'rgba(3, 17, 38, 0.78)', paddingHorizontal: 7, paddingVertical: 5, borderRadius: 7, fontSize: 9, fontWeight: '700' as const },
  previewBottom: { position: 'absolute', bottom: 9, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewChannel: { color: colors.textWhite, fontSize: 12, fontWeight: '800' as const, textShadowColor: '#001329', textShadowRadius: 4 },
  changeCameraButton: { backgroundColor: '#0cb8e7', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 8 },
  changeCameraText: { color: '#062446', fontSize: 9, fontWeight: '900' as const },
  changeCameraLabel: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  datePanel: { marginTop: 9, padding: 11, backgroundColor: '#0a294b', borderWidth: 1, borderColor: '#29628e', borderRadius: 14 },
  panelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  panelTitle: { color: colors.textWhite, fontSize: 12, fontWeight: '900' as const },
  dateTimeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginTop: 8 },
  dateInputGroup: { flex: 1.15 },
  timeInputGroup: { flex: 1 },
  inputCaption: { color: colors.textIceBlue, fontSize: 8, lineHeight: 12, fontWeight: '800' as const, marginBottom: 3 },
  dateInput: { height: 36, borderWidth: 1, borderColor: '#6f9bb9', borderRadius: 8, backgroundColor: '#143354', paddingHorizontal: 8, paddingVertical: 0, color: colors.textWhite, fontSize: 11 },
  timeInput: { height: 36, borderWidth: 1, borderColor: '#6f9bb9', borderRadius: 8, backgroundColor: '#143354', paddingHorizontal: 7, paddingVertical: 0, color: colors.textWhite, fontSize: 10 },
  timeSeparator: { color: colors.textIceBlue, paddingBottom: 9, fontSize: 15 },
  timelinePanel: { marginTop: 9, padding: 11, backgroundColor: '#0a294b', borderWidth: 1, borderColor: '#29628e', borderRadius: 14 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineDate: { color: colors.textIceBlue, fontSize: 10, fontWeight: '700' as const },
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 4 },
  timelineLabel: { color: colors.textIceBlue, fontSize: 8, fontWeight: '600' as const },
  timelineTrack: { height: 28, position: 'relative', overflow: 'hidden', justifyContent: 'center', backgroundColor: '#09203b', borderRadius: 7, borderWidth: 1, borderColor: '#38668d' },
  timelineSegment: { position: 'absolute', top: 2, bottom: 2, borderRadius: 3 },
  timelineNormal: { backgroundColor: '#1686cf' },
  timelineEvent: { backgroundColor: '#f3a332' },
  timelineTick: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(220, 240, 255, 0.36)' },
  timelinePlayhead: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: '#fff', marginLeft: -1 },
  playheadHandle: { position: 'absolute', top: -1, left: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', borderWidth: 2, borderColor: '#08b9e8' },
  timelineLegend: { flexDirection: 'row', alignItems: 'center', marginTop: 9, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendNormal: { width: 8, height: 8, borderRadius: 2, backgroundColor: '#1686cf' },
  legendEvent: { width: 8, height: 8, borderRadius: 2, backgroundColor: '#f3a332' },
  legendText: { color: colors.textIceBlue, fontSize: 8 },
  currentTime: { marginLeft: 'auto', color: colors.brightSkyCyan, fontSize: 10, fontWeight: '900' as const },
  playbackControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingVertical: 8, paddingHorizontal: 5, backgroundColor: '#0a294b', borderWidth: 1, borderColor: '#29628e', borderRadius: 14 },
  controlButton: { minWidth: 38, alignItems: 'center', justifyContent: 'center' },
  controlIcon: { lineHeight: 24 },
  controlIconSmall: { lineHeight: 24 },
  controlCaption: { color: colors.textIceBlue, fontSize: 8, lineHeight: 11, fontWeight: '700' as const },
  playButton: { width: 43, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0abce9', borderWidth: 2, borderColor: '#42e3ff' },
  speedButton: { minWidth: 39, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  speedText: { color: colors.brightSkyCyan, fontSize: 12, lineHeight: 24, fontWeight: '900' as const },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 9 },
  actionButton: { flex: 1, height: 41, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#0a294b', borderWidth: 1, borderColor: '#507b9f', borderRadius: 10 },
  actionText: { color: colors.textWhite, fontSize: 10, fontWeight: '700' as const },
  ptzPanel: { marginTop: 9, padding: 12, backgroundColor: '#0a294b', borderWidth: 1, borderColor: '#29628e', borderRadius: 14 },
  ptzSubtitle: { color: colors.textIceBlue, fontSize: 9, marginTop: 4 },
  resetButton: { borderWidth: 1, borderColor: '#7fa6d6', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 7 },
  resetButtonText: { color: colors.textWhite, fontSize: 9, fontWeight: '900' as const },
  ptzBody: { flexDirection: 'row', gap: 11, alignItems: 'center', marginTop: 15 },
  joystick: { flex: 1.25, gap: 5, alignItems: 'center' },
  joystickRow: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  joystickEmpty: { width: 61, height: 57 },
  ptzButton: { width: 61, height: 57, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b355c', borderWidth: 1, borderColor: '#5790b7', borderRadius: 12 },
  ptzButtonEmphasis: { backgroundColor: '#0bb8e6', borderColor: '#40e1fb' },
  ptzButtonIcon: { lineHeight: 24 },
  ptzButtonLabel: { color: colors.textIceBlue, fontSize: 8, lineHeight: 10, fontWeight: '700' as const },
  ptzButtonLabelEmphasis: { color: '#062243' },
  ptzAdjustments: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  ptzReadouts: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 13, paddingVertical: 9, backgroundColor: '#071f3e', borderRadius: 9 },
  readout: { color: colors.brightSkyCyan, fontSize: 9, fontWeight: '800' as const },
});
