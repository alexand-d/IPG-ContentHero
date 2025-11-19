import * as React from 'react';
import { ColorPicker } from '@fluentui/react';

export interface IBackgroundColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const BackgroundColorPicker: React.FC<IBackgroundColorPickerProps> = ({ color, onChange }) => (
  <div style={{ padding: '0 8px 16px' }}>
    <ColorPicker
      color={color}
      alphaType="none"
      onChange={(_, newColor) => onChange(newColor.str)}
    />
  </div>
);

export default BackgroundColorPicker;
