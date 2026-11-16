import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertItem,
  AppScreen,
  CameraChannel,
  CameraSceneType,
  DeviceType,
  NetFocusUiState,
  ProtocolType,
  SnapshotItem,
  SurveillanceDevice,
  TimelineSegment,
} from './types';
import { initialState } from './types';

export interface NetFocusDerived {
  onlineDeviceCount: number;
  offlineDeviceCount: number;
  nvrDvrCount: number;
  ipCameraCount: number;
  selectedChannel: CameraChannel | undefined;
}

export interface NetFocusActions {
  navigateTo: (screen: AppScreen, pushBackStack?: boolean) => void;
  navigateBack: () => boolean;
  openPlayback: (ptzFocused?: boolean) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeToggle: () => void;
  onPasswordVisibilityToggle: () => void;
  login: () => void;
  logout: () => void;
  selectChannel: (channelId: number) => void;
  setLiveGridCount: (count: number) => void;
  toggleLiveFullscreen: () => void;
  toggleRecordingActiveChannel: () => void;
  toggleAudio: () => void;
  toggleTalk: () => void;
  toggleStreamQuality: () => void;
  captureSnapshot: () => void;
  savePlaybackClip: () => void;
  setPlaybackTab: (isPtz: boolean) => void;
  setTimelinePosition: (pos: number) => void;
  togglePlayPause: () => void;
  skipSeconds: (deltaSeconds: number) => void;
  cyclePlaybackSpeed: () => void;
  selectDate: (date: string) => void;
  selectTimeWindow: (start: string, end: string) => void;
  panPtz: (dx: number, dy: number) => void;
  resetPtz: () => void;
  zoomPtz: (delta: number) => void;
  stepFocus: () => void;
  stepIris: () => void;
  setNewDeviceType: (type: DeviceType) => void;
  setNewDeviceName: (name: string) => void;
  setNewDeviceIp: (ip: string) => void;
  setNewDevicePort: (port: string) => void;
  setNewDeviceUsername: (user: string) => void;
  setNewDevicePassword: (pass: string) => void;
  toggleNewDevicePasswordVisible: () => void;
  setNewDeviceProtocol: (protocol: ProtocolType) => void;
  testDeviceConnection: () => void;
  addDevice: () => void;
  toggleDeviceOnline: (deviceId: string) => void;
  toggleMotionAlerts: () => void;
  toggleAutoRecordMotion: () => void;
  toggleHardwareDecoding: () => void;
  setShowAlertsSheet: (show: boolean) => void;
  setShowSnapshotsSheet: (show: boolean) => void;
  showMessage: (msg: string) => void;
  clearMessage: () => void;
}

interface NetFocusContextValue {
  state: NetFocusUiState;
  actions: NetFocusActions;
  derived: NetFocusDerived;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const NetFocusContext = createContext<NetFocusContextValue | undefined>(undefined);

export function useNetFocus(): NetFocusContextValue {
  const ctx = useContext(NetFocusContext);
  if (!ctx) {
    throw new Error('useNetFocus must be used within a NetFocusProvider');
  }
  return ctx;
}

const SPEED_MULTIPLIERS: Record<string, number> = {
  '0.5X': 0.5,
  '2X': 2,
  '4X': 4,
};

export function NetFocusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NetFocusUiState>(initialState);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Playback ticker (1s tick advancing the playback timeline)
  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => {
        if (s.currentScreen !== AppScreen.Playback || !s.isPlayingPlayback) {
          return s;
        }
        const speedMultiplier = SPEED_MULTIPLIERS[s.playbackSpeed] ?? 1;
        const step = (1 / 7200) * speedMultiplier;
        const next = s.timelinePosition + step;
        return { ...s, timelinePosition: next > 1 ? 0 : next };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const derived = useMemo<NetFocusDerived>(
    () => ({
      onlineDeviceCount: state.devices.filter((d) => d.isOnline).length,
      offlineDeviceCount: state.devices.filter((d) => !d.isOnline).length,
      nvrDvrCount: state.devices.filter((d) => d.type === DeviceType.NVR || d.type === DeviceType.DVR).length,
      ipCameraCount: state.devices.filter((d) => d.type === DeviceType.IP_CAMERA).length,
      selectedChannel:
        state.channels.find((c) => c.id === state.selectedChannelId) ?? state.channels[0],
    }),
    [state.devices, state.channels, state.selectedChannelId],
  );

  const actions: NetFocusActions = {
    navigateTo: (screen, pushBackStack = true) => {
      setState((s) => {
        if (s.currentScreen === screen) {
          return s;
        }
        const nextStack = pushBackStack ? [...s.backStack, s.currentScreen] : [];
        return { ...s, currentScreen: screen, backStack: nextStack, isLiveFullscreen: false };
      });
    },

    navigateBack: () => {
      if (state.isLiveFullscreen) {
        setState((s) => ({ ...s, isLiveFullscreen: false }));
        return true;
      }
      const previous = state.backStack[state.backStack.length - 1];
      if (previous === undefined) {
        return false;
      }
      setState((s) => ({
        ...s,
        currentScreen: previous,
        backStack: s.backStack.slice(0, -1),
      }));
      return true;
    },

    openPlayback: (ptzFocused = false) => {
      setState((s) => ({
        ...s,
        currentScreen: AppScreen.Playback,
        backStack: s.currentScreen === AppScreen.Playback ? s.backStack : [...s.backStack, s.currentScreen],
        playbackTabIsPtz: ptzFocused,
      }));
    },

    onUsernameChange: (value) => setState((s) => ({ ...s, username: value })),
    onPasswordChange: (value) => setState((s) => ({ ...s, password: value })),
    onRememberMeToggle: () => setState((s) => ({ ...s, rememberMe: !s.rememberMe })),
    onPasswordVisibilityToggle: () => setState((s) => ({ ...s, isPasswordVisible: !s.isPasswordVisible })),

    login: () =>
      setState((s) => ({
        ...s,
        currentScreen: AppScreen.Home,
        backStack: [],
        snackbarMessage: 'Connected to NetFocus Cloud',
      })),

    logout: () =>
      setState((s) => ({
        ...s,
        currentScreen: AppScreen.Login,
        backStack: [],
        snackbarMessage: 'Signed out safely',
      })),

    selectChannel: (channelId) => setState((s) => ({ ...s, selectedChannelId: channelId })),
    setLiveGridCount: (count) => setState((s) => ({ ...s, liveGridCount: count })),
    toggleLiveFullscreen: () => setState((s) => ({ ...s, isLiveFullscreen: !s.isLiveFullscreen })),

    toggleRecordingActiveChannel: () =>
      setState((s) => {
        const selected = s.channels.find((c) => c.id === s.selectedChannelId);
        const updated = s.channels.map((c) =>
          c.id === s.selectedChannelId ? { ...c, isRecording: !c.isRecording } : c,
        );
        const nowRecording = updated.find((c) => c.id === s.selectedChannelId)?.isRecording ?? false;
        return {
          ...s,
          channels: updated,
          snackbarMessage: nowRecording
            ? `Recording started on ${selected?.code ?? ''}`
            : `Recording saved for ${selected?.code ?? ''}`,
        };
      }),

    toggleAudio: () =>
      setState((s) => ({
        ...s,
        isAudioEnabled: !s.isAudioEnabled,
        snackbarMessage: !s.isAudioEnabled ? 'Audio monitoring ON' : 'Audio muted',
      })),

    toggleTalk: () =>
      setState((s) => ({
        ...s,
        isTalkEnabled: !s.isTalkEnabled,
        snackbarMessage: !s.isTalkEnabled ? 'Two-way intercom active' : 'Intercom closed',
      })),

    toggleStreamQuality: () =>
      setState((s) => ({
        ...s,
        isStreamHd: !s.isStreamHd,
        snackbarMessage: !s.isStreamHd ? 'Switched to HD (1080p) stream' : 'Switched to SD (480p) stream',
      })),

    captureSnapshot: () =>
      setState((s) => {
        const channel = s.channels.find((c) => c.id === s.selectedChannelId);
        const timeStr =
          s.currentScreen === AppScreen.Playback
            ? `${s.selectedDate} ${formatTimelineTime(s.timelinePosition)}`
            : '2026-11-11 10:24:18';
        const newSnap: SnapshotItem = {
          id: `sn-${Date.now()}`,
          cameraCode: channel?.code.replace('CH', 'CAM') ?? '',
          cameraName: channel?.nameEn ?? '',
          timestamp: timeStr,
          sceneType: channel?.sceneType ?? CameraSceneType.MAIN_GATE,
        };
        return {
          ...s,
          snapshots: [newSnap, ...s.snapshots],
          snackbarMessage: `Snapshot saved: ${channel?.code ?? ''} (${channel?.nameEn ?? ''})`,
        };
      }),

    savePlaybackClip: () =>
      setState((s) => {
        const channel = s.channels.find((c) => c.id === s.selectedChannelId);
        return {
          ...s,
          snackbarMessage: `Clip exported (${formatTimelineTime(s.timelinePosition)}) • ${channel?.nameEn ?? ''}`,
        };
      }),

    setPlaybackTab: (isPtz) => setState((s) => ({ ...s, playbackTabIsPtz: isPtz })),
    setTimelinePosition: (pos) => setState((s) => ({ ...s, timelinePosition: Math.min(Math.max(pos, 0), 1) })),
    togglePlayPause: () => setState((s) => ({ ...s, isPlayingPlayback: !s.isPlayingPlayback })),

    skipSeconds: (deltaSeconds) =>
      setState((s) => ({
        ...s,
        timelinePosition: Math.min(Math.max(s.timelinePosition + deltaSeconds / 7200, 0), 1),
      })),

    cyclePlaybackSpeed: () =>
      setState((s) => {
        const speeds = ['0.5X', '1X', '2X', '4X'];
        const currentIndex = speeds.indexOf(s.playbackSpeed);
        const next = speeds[(currentIndex + 1) % speeds.length];
        return { ...s, playbackSpeed: next };
      }),

    selectDate: (date) => setState((s) => ({ ...s, selectedDate: date })),
    selectTimeWindow: (start, end) => setState((s) => ({ ...s, selectedStartTime: start, selectedEndTime: end })),

    panPtz: (dx, dy) =>
      setState((s) => ({
        ...s,
        ptzPanX: Math.min(Math.max(s.ptzPanX + dx, -1), 1),
        ptzPanY: Math.min(Math.max(s.ptzPanY + dy, -1), 1),
      })),

    resetPtz: () =>
      setState((s) => ({
        ...s,
        ptzPanX: 0,
        ptzPanY: 0,
        ptzZoom: 1,
        snackbarMessage: 'PTZ camera centered',
      })),

    zoomPtz: (delta) =>
      setState((s) => {
        const nextZoom = Math.min(Math.max(s.ptzZoom + delta, 1), 2.5);
        return { ...s, ptzZoom: nextZoom, snackbarMessage: `Optical Zoom ${nextZoom.toFixed(1)}x` };
      }),

    stepFocus: () =>
      setState((s) => {
        const next = s.ptzFocusLevel >= 95 ? 60 : s.ptzFocusLevel + 7;
        return { ...s, ptzFocusLevel: next, snackbarMessage: `Auto-Focus calibrated (${next}%)` };
      }),

    stepIris: () =>
      setState((s) => {
        const next = s.ptzIrisLevel >= 90 ? 45 : s.ptzIrisLevel + 8;
        return { ...s, ptzIrisLevel: next, snackbarMessage: `Iris aperture adjusted (${next}%)` };
      }),

    setNewDeviceType: (type) => setState((s) => ({ ...s, newDeviceType: type })),
    setNewDeviceName: (name) => setState((s) => ({ ...s, newDeviceName: name })),
    setNewDeviceIp: (ip) => setState((s) => ({ ...s, newDeviceIp: ip })),
    setNewDevicePort: (port) => setState((s) => ({ ...s, newDevicePort: port })),
    setNewDeviceUsername: (user) => setState((s) => ({ ...s, newDeviceUsername: user })),
    setNewDevicePassword: (pass) => setState((s) => ({ ...s, newDevicePassword: pass })),
    toggleNewDevicePasswordVisible: () => setState((s) => ({ ...s, newDevicePasswordVisible: !s.newDevicePasswordVisible })),
    setNewDeviceProtocol: (protocol) => setState((s) => ({ ...s, newDeviceProtocol: protocol })),

    testDeviceConnection: () => {
      if (!state.newDeviceIp || !state.newDevicePort) {
        setState((s) => ({ ...s, connectionTestStatus: 'Enter valid IP address & port' }));
        return;
      }
      const protocolLabel = state.newDeviceProtocol === ProtocolType.ONVIF ? 'ONVIF' : 'RTSP';
      setState((s) => ({ ...s, isTestingConnection: true, connectionTestStatus: null }));
      setTimeout(() => {
        setState((s) => ({
          ...s,
          isTestingConnection: false,
          connectionTestStatus: `Handshake OK • ${protocolLabel} (${s.newDeviceIp}:${s.newDevicePort})`,
        }));
      }, 750);
    },

    addDevice: () => {
      const s = state;
      if (!s.newDeviceName || !s.newDeviceIp) {
        setState((st) => ({ ...st, snackbarMessage: 'Please enter Device Name and IP Address' }));
        return;
      }
      const newDev: SurveillanceDevice = {
        id: `dev-${Date.now()}`,
        name: s.newDeviceName.trim(),
        ipAddress: s.newDeviceIp.trim(),
        port: s.newDevicePort || '8000',
        username: s.newDeviceUsername || 'admin',
        type: s.newDeviceType,
        protocol: s.newDeviceProtocol,
        isOnline: true,
        channels: s.newDeviceType === DeviceType.IP_CAMERA ? 1 : 8,
      };
      setState((st) => ({
        ...st,
        devices: [...st.devices, newDev],
        connectionTestStatus: null,
        currentScreen: AppScreen.Devices,
        snackbarMessage: `${newDev.name} added (${newDev.protocol === ProtocolType.ONVIF ? 'ONVIF' : 'RTSP'})`,
      }));
    },

    toggleDeviceOnline: (deviceId) =>
      setState((s) => ({
        ...s,
        devices: s.devices.map((d) => (d.id === deviceId ? { ...d, isOnline: !d.isOnline } : d)),
      })),

    toggleMotionAlerts: () => setState((s) => ({ ...s, motionAlertsEnabled: !s.motionAlertsEnabled })),
    toggleAutoRecordMotion: () => setState((s) => ({ ...s, autoRecordMotion: !s.autoRecordMotion })),
    toggleHardwareDecoding: () => setState((s) => ({ ...s, hardwareDecoding: !s.hardwareDecoding })),
    setShowAlertsSheet: (show) => setState((s) => ({ ...s, showAlertsSheet: show })),
    setShowSnapshotsSheet: (show) => setState((s) => ({ ...s, showSnapshotsSheet: show })),
    showMessage: (msg) => setState((s) => ({ ...s, snackbarMessage: msg })),
    clearMessage: () => setState((s) => ({ ...s, snackbarMessage: null })),
  };

  const value = useMemo(
    () => ({ state, actions, derived, drawerOpen, setDrawerOpen }),
    [state, actions, derived, drawerOpen],
  );

  return <NetFocusContext.Provider value={value}>{children}</NetFocusContext.Provider>;
}

export function formatTimelineTime(fraction: number): string {
  const totalSeconds = Math.floor(Math.min(Math.max(fraction, 0), 1) * 7200);
  const hours = 9 + Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
