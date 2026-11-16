import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type AppIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface AppIconProps {
  name: AppIconName;
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AppIcon({ name, size, color, style }: AppIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
