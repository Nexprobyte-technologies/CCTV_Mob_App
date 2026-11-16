import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NetFocusHeader, SurveillanceBackground } from '../components/NetFocusChrome';
import { useNetFocus } from '../state';
import { DeviceType, ProtocolType } from '../types';
import { colors } from '../theme';
import { AppIcon, AppIconName } from '../components/AppIcon';

const DEVICE_TYPES: { type: DeviceType; icon: AppIconName }[] = [
  { type: DeviceType.IP_CAMERA, icon: 'cctv' },
  { type: DeviceType.NVR, icon: 'server-network' },
  { type: DeviceType.DVR, icon: 'video-input-component' },
];

export function AddDeviceScreen() {
  const { state, actions } = useNetFocus();

  const handleTest = () => {
    if (!state.newDeviceIp || !state.newDevicePort) {
      actions.showMessage('Enter valid IP address & port');
      return;
    }
    actions.testDeviceConnection();
  };

  const renderField = (
    icon: AppIconName,
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    options: { keyboardType?: 'default' | 'decimal-pad' | 'number-pad'; password?: boolean } = {},
  ) => (
    <View style={styles.fieldRow}>
      <AppIcon name={icon} size={20} color={colors.textWhite} style={styles.fieldIcon} />
      <View style={styles.fieldLabel}>
        <Text style={styles.fieldLabelText}>
          {label}<Text style={styles.required}> *</Text>
        </Text>
      </View>
      <View style={styles.fieldInputWrap}>
        <TextInput
          style={[styles.input, options.password && styles.passwordInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={colors.textMutedBlue}
          keyboardType={options.keyboardType ?? 'default'}
          secureTextEntry={Boolean(options.password) && !state.newDevicePasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {options.password ? (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={actions.toggleNewDevicePasswordVisible}
            accessibilityLabel={state.newDevicePasswordVisible ? 'Hide password' : 'Show password'}
          >
            <AppIcon
              name={state.newDevicePasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.textWhite}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <SurveillanceBackground>
      <View style={styles.screen}>
        <NetFocusHeader variant="back" />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBanner}>
            <AppIcon name="plus-circle-outline" size={43} color={colors.textWhite} style={styles.bannerIcon} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerEnglish}>Add Device</Text>
            </View>
            <View style={styles.bannerCut} />
          </View>

          <Text style={styles.sectionTitle}>Device Type</Text>
          <View style={styles.deviceTypes}>
            {DEVICE_TYPES.map(({ type, icon }) => {
              const active = state.newDeviceType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.deviceType, active && styles.deviceTypeActive]}
                  activeOpacity={0.85}
                  onPress={() => actions.setNewDeviceType(type)}
                >
                  {active ? <AppIcon name="check-circle" size={20} color={colors.brightSkyCyan} style={styles.selectedCheck} /> : null}
                  <AppIcon name={icon} size={29} color={colors.textWhite} style={styles.deviceTypeIcon} />
                  <Text style={styles.deviceTypeName}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.formPanel}>
            {renderField('devices', 'Device Name', state.newDeviceName, actions.setNewDeviceName)}
            {renderField('ip-network-outline', 'IP Address', state.newDeviceIp, actions.setNewDeviceIp, { keyboardType: 'decimal-pad' })}
            {renderField('ethernet', 'Port', state.newDevicePort, actions.setNewDevicePort, { keyboardType: 'number-pad' })}
            {renderField('account-outline', 'Username', state.newDeviceUsername, actions.setNewDeviceUsername)}
            {renderField('lock-outline', 'Password', state.newDevicePassword, actions.setNewDevicePassword, { password: true })}

            <View style={styles.protocolSection}>
              <View style={styles.protocolHeadingRow}>
                <AppIcon name="link-variant" size={18} color={colors.textWhite} />
                <Text style={styles.protocolHeading}>Connection Protocol</Text>
              </View>
              <View style={styles.protocolRow}>
                {[ProtocolType.ONVIF, ProtocolType.RTSP].map((protocol) => {
                  const active = state.newDeviceProtocol === protocol;
                  return (
                    <TouchableOpacity
                      key={protocol}
                      style={[styles.protocolButton, active && styles.protocolButtonActive]}
                      activeOpacity={0.85}
                      onPress={() => actions.setNewDeviceProtocol(protocol)}
                    >
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active ? <View style={styles.radioDot} /> : null}
                      </View>
                      <Text style={[styles.protocolText, active && styles.protocolTextActive]}>{protocol}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <Text style={styles.testStatus}>
            {state.isTestingConnection ? 'Testing connection…' : state.connectionTestStatus ?? ''}
          </Text>
        </ScrollView>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.testButton} activeOpacity={0.85} onPress={handleTest}>
            <AppIcon name="play-circle-outline" size={28} color={colors.textWhite} style={styles.actionIcon} />
            <View style={styles.actionCopy}>
              <Text style={styles.testButtonText}>Test Connection</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={actions.addDevice}>
            <AppIcon name="plus-circle-outline" size={30} color="#062b48" style={styles.addIcon} />
            <View style={styles.actionCopy}>
              <Text style={styles.addButtonText}>Add Device</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SurveillanceBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.deepNavyBg },
  scroll: { flex: 1 },
  content: { paddingBottom: 8 },
  titleBanner: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#075ba9',
    overflow: 'hidden',
  },
  bannerIcon: { marginRight: 13 },
  bannerText: { zIndex: 1 },
  bannerEnglish: { color: colors.textWhite, fontSize: 16, lineHeight: 20, fontWeight: '700' as const },
  bannerCut: {
    position: 'absolute',
    width: 120,
    height: 120,
    right: -48,
    bottom: -82,
    backgroundColor: colors.brightSkyCyan,
    transform: [{ rotate: '42deg' }],
  },
  sectionTitle: { color: colors.textWhite, fontSize: 14, fontWeight: '800' as const, marginHorizontal: 17, marginTop: 13, marginBottom: 8 },
  deviceTypes: { flexDirection: 'row', gap: 7, marginHorizontal: 14, marginBottom: 10 },
  deviceType: {
    flex: 1,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    backgroundColor: '#071f3e',
    borderWidth: 1.5,
    borderColor: '#507ca1',
    borderRadius: 13,
  },
  deviceTypeActive: { backgroundColor: '#075082', borderWidth: 2, borderColor: colors.brightSkyCyan },
  selectedCheck: { position: 'absolute', top: 5, right: 7 },
  deviceTypeIcon: { lineHeight: 34 },
  deviceTypeName: { color: colors.textWhite, fontSize: 13, lineHeight: 18, fontWeight: '800' as const, textAlign: 'center' },
  formPanel: {
    marginHorizontal: 11,
    backgroundColor: '#0a294b',
    borderWidth: 1,
    borderColor: '#29628e',
    borderRadius: 17,
    paddingHorizontal: 9,
    paddingTop: 8,
  },
  fieldRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#264c70',
  },
  fieldIcon: { width: 31, textAlign: 'center' },
  fieldLabel: { width: '42%', paddingHorizontal: 6 },
  fieldLabelText: { color: colors.textWhite, fontSize: 10, lineHeight: 14, fontWeight: '700' as const },
  required: { color: '#ff5964', fontWeight: '900' as const },
  fieldInputWrap: { flex: 1, justifyContent: 'center' },
  input: {
    height: 40,
    borderWidth: 1.2,
    borderColor: '#6f9bb9',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 0,
    color: colors.textWhite,
    backgroundColor: '#143354',
    fontSize: 12,
  },
  passwordInput: { paddingRight: 39 },
  passwordToggle: { position: 'absolute', right: 7, top: 0, bottom: 0, width: 30, alignItems: 'center', justifyContent: 'center' },
  protocolSection: { paddingVertical: 12, paddingHorizontal: 8 },
  protocolHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  protocolHeading: { color: colors.textWhite, fontSize: 13, fontWeight: '800' as const },
  protocolRow: { flexDirection: 'row', gap: 10 },
  protocolButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#0b2b4e',
    borderWidth: 1.5,
    borderColor: '#507b9f',
    borderRadius: 12,
  },
  protocolButtonActive: { backgroundColor: '#09b4e4', borderColor: '#23e4ff' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textWhite, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#08264b' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#08264b' },
  protocolText: { color: colors.textWhite, fontSize: 14, fontWeight: '800' as const },
  protocolTextActive: { color: '#061c37' },
  testStatus: { color: colors.onlineGreenBright, fontSize: 10, textAlign: 'center', marginTop: 4, minHeight: 14 },
  actionRow: { flexDirection: 'row', gap: 9, paddingHorizontal: 11, paddingTop: 5, paddingBottom: 9 },
  testButton: { flex: 1, minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#092441', borderWidth: 1.5, borderColor: '#8bb6d5', borderRadius: 14, paddingHorizontal: 5 },
  addButton: { flex: 1, minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#08b9e8', borderWidth: 1.5, borderColor: '#24e5ff', borderRadius: 14, paddingHorizontal: 5 },
  actionIcon: { lineHeight: 34, marginRight: 6 },
  addIcon: { lineHeight: 34, marginRight: 6 },
  actionCopy: { alignItems: 'center', flexShrink: 1 },
  testButtonText: { color: colors.textWhite, fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
  addButtonText: { color: '#062b48', fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
});
