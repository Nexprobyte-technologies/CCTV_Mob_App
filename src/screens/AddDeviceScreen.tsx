import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NetFocusHeader, SurveillanceBackground } from '../components/NetFocusChrome';
import { useNetFocus } from '../state';
import { DeviceType, ProtocolType } from '../types';
import { colors } from '../theme';

const DEVICE_TYPES: { type: DeviceType; icon: string }[] = [
  { type: DeviceType.IP_CAMERA, icon: '◉' },
  { type: DeviceType.NVR, icon: '▰' },
  { type: DeviceType.DVR, icon: '▣' },
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
    icon: string,
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    options: { keyboardType?: 'default' | 'decimal-pad' | 'number-pad'; password?: boolean } = {},
  ) => (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldIcon}>{icon}</Text>
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
            <Text style={styles.passwordToggleText}>{state.newDevicePasswordVisible ? '◉' : '⊘'}</Text>
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
            <Text style={styles.bannerIcon}>⊕</Text>
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
                  {active ? <Text style={styles.selectedCheck}>✓</Text> : null}
                  <Text style={styles.deviceTypeIcon}>{icon}</Text>
                  <Text style={styles.deviceTypeName}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.formPanel}>
            {renderField('▣', 'Device Name', state.newDeviceName, actions.setNewDeviceName)}
            {renderField('IP', 'IP Address', state.newDeviceIp, actions.setNewDeviceIp, { keyboardType: 'decimal-pad' })}
            {renderField('▤', 'Port', state.newDevicePort, actions.setNewDevicePort, { keyboardType: 'number-pad' })}
            {renderField('♙', 'Username', state.newDeviceUsername, actions.setNewDeviceUsername)}
            {renderField('♙', 'Password', state.newDevicePassword, actions.setNewDevicePassword, { password: true })}

            <View style={styles.protocolSection}>
              <Text style={styles.protocolHeading}>⛓  Connection Protocol</Text>
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
            <Text style={styles.actionIcon}>▷</Text>
            <View style={styles.actionCopy}>
              <Text style={styles.testButtonText}>Test Connection</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={actions.addDevice}>
            <Text style={styles.addIcon}>⊕</Text>
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
  bannerIcon: { color: colors.textWhite, fontSize: 43, lineHeight: 50, fontWeight: '700' as const, marginRight: 13 },
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
  selectedCheck: { position: 'absolute', top: 5, right: 7, color: '#061a34', backgroundColor: colors.brightSkyCyan, overflow: 'hidden', borderRadius: 10, width: 20, height: 20, textAlign: 'center', fontWeight: '900' as const },
  deviceTypeIcon: { color: colors.textWhite, fontSize: 29, lineHeight: 34, fontWeight: '800' as const },
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
  fieldIcon: { width: 31, color: colors.textWhite, fontSize: 20, textAlign: 'center', fontWeight: '700' as const },
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
  passwordToggleText: { color: colors.textWhite, fontSize: 18 },
  protocolSection: { paddingVertical: 12, paddingHorizontal: 8 },
  protocolHeading: { color: colors.textWhite, fontSize: 13, fontWeight: '800' as const, marginBottom: 8 },
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
  actionIcon: { color: colors.textWhite, fontSize: 28, lineHeight: 34, marginRight: 6 },
  addIcon: { color: '#062b48', fontSize: 30, lineHeight: 34, marginRight: 6 },
  actionCopy: { alignItems: 'center', flexShrink: 1 },
  testButtonText: { color: colors.textWhite, fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
  addButtonText: { color: '#062b48', fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
});
