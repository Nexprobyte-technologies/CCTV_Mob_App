/**
 * Domain models for the NetFocus CCTV surveillance app.
 * Mirrors the previous Kotlin data classes / enums (AppScreen, DeviceType, ...).
 */

export enum AppScreen {
  Welcome = 'Welcome',
  Login = 'Login',
  CreateAccount = 'CreateAccount',
  Home = 'Home',
  LiveView = 'LiveView',
  Playback = 'Playback',
  AddDevice = 'AddDevice',
  Devices = 'Devices',
  Settings = 'Settings',
}

export enum DeviceType {
  IP_CAMERA = 'IP Camera',
  NVR = 'NVR',
  DVR = 'DVR',
}

export enum ProtocolType {
  ONVIF = 'ONVIF',
  RTSP = 'RTSP',
}

export enum CameraSceneType {
  MAIN_GATE = 'MAIN_GATE',
  RECEPTION = 'RECEPTION',
  PARKING_LOT = 'PARKING_LOT',
  OFFICE_DESKS = 'OFFICE_DESKS',
  WAREHOUSE = 'WAREHOUSE',
  STAIRCASE = 'STAIRCASE',
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
  CORRIDOR = 'CORRIDOR',
  LOADING_BAY = 'LOADING_BAY',
  COURTYARD_LAWN = 'COURTYARD_LAWN',
  SECURITY_BARRIER = 'SECURITY_BARRIER',
  WALKWAY = 'WALKWAY',
}

export interface CameraChannel {
  id: number;
  code: string;
  nameEn: string;
  sceneType: CameraSceneType;
  isOnline: boolean;
  isRecording: boolean;
  isHd: boolean;
  hasMotionEvent: boolean;
}

export interface SurveillanceDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: string;
  username: string;
  type: DeviceType;
  protocol: ProtocolType;
  isOnline: boolean;
  channels: number;
}

export interface TimelineSegment {
  startFraction: number;
  endFraction: number;
  isEvent: boolean;
}

export interface AlertItem {
  id: string;
  cameraCode: string;
  title: string;
  time: string;
  isUrgent: boolean;
}

export interface SnapshotItem {
  id: string;
  cameraCode: string;
  cameraName: string;
  timestamp: string;
  sceneType: CameraSceneType;
}

export interface NetFocusUiState {
  // Navigation
  currentScreen: AppScreen;
  backStack: AppScreen[];

  // Login state
  username: string;
  password: string;
  rememberMe: boolean;
  isPasswordVisible: boolean;

  // Devices & Channels
  devices: SurveillanceDevice[];
  channels: CameraChannel[];
  selectedChannelId: number;
  liveGridCount: number;
  isLiveFullscreen: boolean;
  isAudioEnabled: boolean;
  isTalkEnabled: boolean;
  isStreamHd: boolean;

  // Playback & PTZ state
  playbackTabIsPtz: boolean;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  timelinePosition: number;
  isPlayingPlayback: boolean;
  playbackSpeed: string;
  timelineSegments: TimelineSegment[];
  ptzPanX: number;
  ptzPanY: number;
  ptzZoom: number;
  ptzFocusLevel: number;
  ptzIrisLevel: number;

  // Add Device form state
  newDeviceType: DeviceType;
  newDeviceName: string;
  newDeviceIp: string;
  newDevicePort: string;
  newDeviceUsername: string;
  newDevicePassword: string;
  newDevicePasswordVisible: boolean;
  newDeviceProtocol: ProtocolType;
  isTestingConnection: boolean;
  connectionTestStatus: string | null;

  // Alerts & Snapshots & Settings
  alerts: AlertItem[];
  snapshots: SnapshotItem[];
  motionAlertsEnabled: boolean;
  autoRecordMotion: boolean;
  hardwareDecoding: boolean;
  showAlertsSheet: boolean;
  showSnapshotsSheet: boolean;
  snackbarMessage: string | null;
}

export const initialState: NetFocusUiState = {
  currentScreen: AppScreen.Welcome,
  backStack: [],

  username: 'admin@netfocus.in',
  password: 'NetFocus@2026',
  rememberMe: true,
  isPasswordVisible: false,

  devices: defaultDevices(),
  channels: defaultChannels(),
  selectedChannelId: 1,
  liveGridCount: 16,
  isLiveFullscreen: false,
  isAudioEnabled: false,
  isTalkEnabled: false,
  isStreamHd: true,

  playbackTabIsPtz: false,
  selectedDate: '2026-11-11',
  selectedStartTime: '09:00 AM',
  selectedEndTime: '11:00 AM',
  timelinePosition: 0.628,
  isPlayingPlayback: true,
  playbackSpeed: '1X',
  timelineSegments: defaultTimelineSegments(),
  ptzPanX: 0,
  ptzPanY: 0,
  ptzZoom: 1,
  ptzFocusLevel: 78,
  ptzIrisLevel: 64,

  newDeviceType: DeviceType.IP_CAMERA,
  newDeviceName: 'Office Camera',
  newDeviceIp: '192.168.1.100',
  newDevicePort: '8000',
  newDeviceUsername: 'admin',
  newDevicePassword: '••••••••',
  newDevicePasswordVisible: false,
  newDeviceProtocol: ProtocolType.ONVIF,
  isTestingConnection: false,
  connectionTestStatus: null,

  alerts: defaultAlerts(),
  snapshots: defaultSnapshots(),
  motionAlertsEnabled: true,
  autoRecordMotion: true,
  hardwareDecoding: true,
  showAlertsSheet: false,
  showSnapshotsSheet: false,
  snackbarMessage: null,
};

export function defaultDevices(): SurveillanceDevice[] {
  return [
  { id: 'dev-1', name: 'Office NVR', ipAddress: '192.168.1.50', port: '8000', username: 'admin', type: DeviceType.NVR, protocol: ProtocolType.ONVIF, isOnline: true, channels: 16 },
  { id: 'dev-2', name: 'Main Gate Cam', ipAddress: '192.168.1.101', port: '8000', username: 'admin', type: DeviceType.IP_CAMERA, protocol: ProtocolType.ONVIF, isOnline: true, channels: 1 },
  { id: 'dev-3', name: 'Parking PTZ Dome', ipAddress: '192.168.1.102', port: '554', username: 'admin', type: DeviceType.IP_CAMERA, protocol: ProtocolType.RTSP, isOnline: true, channels: 1 },
  { id: 'dev-4', name: 'Warehouse Entry', ipAddress: '192.168.1.103', port: '8000', username: 'admin', type: DeviceType.IP_CAMERA, protocol: ProtocolType.ONVIF, isOnline: true, channels: 1 },
  ];
}

export function defaultChannels(): CameraChannel[] {
  return [
  { id: 1, code: 'CH 01', nameEn: 'Main Gate', sceneType: CameraSceneType.MAIN_GATE, isOnline: true, isRecording: true, isHd: true, hasMotionEvent: true },
  { id: 2, code: 'CH 02', nameEn: 'Front Porch', sceneType: CameraSceneType.RECEPTION, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 3, code: 'CH 03', nameEn: 'Parking Lot', sceneType: CameraSceneType.PARKING_LOT, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: true },
  { id: 4, code: 'CH 04', nameEn: 'Reception', sceneType: CameraSceneType.RECEPTION, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 5, code: 'CH 05', nameEn: 'Garden Path', sceneType: CameraSceneType.WALKWAY, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 6, code: 'CH 06', nameEn: 'Office Floor A', sceneType: CameraSceneType.OFFICE_DESKS, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 7, code: 'CH 07', nameEn: 'Warehouse', sceneType: CameraSceneType.WAREHOUSE, isOnline: true, isRecording: true, isHd: true, hasMotionEvent: false },
  { id: 8, code: 'CH 08', nameEn: 'Staircase', sceneType: CameraSceneType.STAIRCASE, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 9, code: 'CH 09', nameEn: 'Conference', sceneType: CameraSceneType.CONFERENCE_ROOM, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 10, code: 'CH 10', nameEn: 'Office Floor B', sceneType: CameraSceneType.OFFICE_DESKS, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 11, code: 'CH 11', nameEn: 'Loading Bay', sceneType: CameraSceneType.LOADING_BAY, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: true },
  { id: 12, code: 'CH 12', nameEn: 'Bike Shed', sceneType: CameraSceneType.PARKING_LOT, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 13, code: 'CH 13', nameEn: 'Corridor', sceneType: CameraSceneType.CORRIDOR, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 14, code: 'CH 14', nameEn: 'Courtyard Lawn', sceneType: CameraSceneType.COURTYARD_LAWN, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 15, code: 'CH 15', nameEn: 'Exit Barrier', sceneType: CameraSceneType.SECURITY_BARRIER, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  { id: 16, code: 'CH 16', nameEn: 'Side Walkway', sceneType: CameraSceneType.WALKWAY, isOnline: true, isRecording: false, isHd: true, hasMotionEvent: false },
  ];
}

export function defaultTimelineSegments(): TimelineSegment[] {
  return [
    { startFraction: 0.0, endFraction: 0.14, isEvent: false },
    { startFraction: 0.14, endFraction: 0.18, isEvent: true },
    { startFraction: 0.18, endFraction: 0.21, isEvent: false },
    { startFraction: 0.21, endFraction: 0.25, isEvent: true },
    { startFraction: 0.25, endFraction: 0.4, isEvent: false },
    { startFraction: 0.4, endFraction: 0.45, isEvent: true },
    { startFraction: 0.45, endFraction: 0.61, isEvent: false },
    { startFraction: 0.61, endFraction: 0.65, isEvent: true },
    { startFraction: 0.65, endFraction: 0.87, isEvent: false },
    { startFraction: 0.87, endFraction: 0.91, isEvent: true },
    { startFraction: 0.91, endFraction: 1.0, isEvent: false },
  ];
}

export function defaultAlerts(): AlertItem[] {
  return [
  { id: 'al-1', cameraCode: 'CAM 01', title: 'Motion detected at Main Gate', time: '10:15 AM', isUrgent: true },
  { id: 'al-2', cameraCode: 'CAM 11', title: 'Vehicle arrival in Loading Bay', time: '09:48 AM', isUrgent: false },
  { id: 'al-3', cameraCode: 'CAM 03', title: 'Perimeter line crossed - Parking', time: '09:22 AM', isUrgent: true },
  ];
}

export function defaultSnapshots(): SnapshotItem[] {
  return [
    { id: 'sn-1', cameraCode: 'CAM 01', cameraName: 'Main Gate', timestamp: '2026-11-11 10:15:32', sceneType: CameraSceneType.MAIN_GATE },
    { id: 'sn-2', cameraCode: 'CAM 03', cameraName: 'Parking Lot', timestamp: '2026-11-11 09:42:10', sceneType: CameraSceneType.PARKING_LOT },
    { id: 'sn-3', cameraCode: 'CAM 07', cameraName: 'Warehouse', timestamp: '2026-11-11 08:30:05', sceneType: CameraSceneType.WAREHOUSE },
  ];
}

export const cameraSceneLabels: Record<CameraSceneType, string> = {
  [CameraSceneType.MAIN_GATE]: 'Main Gate',
  [CameraSceneType.RECEPTION]: 'Reception',
  [CameraSceneType.PARKING_LOT]: 'Parking Lot',
  [CameraSceneType.OFFICE_DESKS]: 'Office Desks',
  [CameraSceneType.WAREHOUSE]: 'Warehouse',
  [CameraSceneType.STAIRCASE]: 'Staircase',
  [CameraSceneType.CONFERENCE_ROOM]: 'Conference Room',
  [CameraSceneType.CORRIDOR]: 'Corridor',
  [CameraSceneType.LOADING_BAY]: 'Loading Bay',
  [CameraSceneType.COURTYARD_LAWN]: 'Courtyard Lawn',
  [CameraSceneType.SECURITY_BARRIER]: 'Security Barrier',
  [CameraSceneType.WALKWAY]: 'Walkway',
};
