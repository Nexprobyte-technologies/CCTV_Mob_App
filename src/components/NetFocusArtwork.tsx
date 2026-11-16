import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface NetFocusArtworkProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function NetFocusArtwork({ size = 96, style }: NetFocusArtworkProps) {
  const imageWidth = size * 2.35;
  return (
    <View style={[styles.container, { width: imageWidth, height: size }, style]}>
      <Image
        source={require('../assets/images/netfocus-logo.png')}
        style={{ width: imageWidth, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8e8e8', borderRadius: 5, overflow: 'hidden' },
});

export default NetFocusArtwork;
