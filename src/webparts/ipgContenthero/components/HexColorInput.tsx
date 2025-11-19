import * as React from 'react';
import {
  ColorPicker,
  DefaultButton,
  IColor,
  Label,
  Stack,
  TextField
} from '@fluentui/react';

export interface IHexColorInputProps {
  label?: string;
  color: string;
  onChange: (color: string) => void;
}

const normalizeHex = (value: string): string => {
  if (!value) {
    return '#000000';
  }
  let normalized = value.charAt(0) === '#' ? value : `#${value}`;
  if (normalized.length === 4) {
    normalized =
      '#' +
      normalized
        .substring(1)
        .split('')
        .map((char) => `${char}${char}`)
        .join('');
  }
  return normalized;
};

const HexColorInput: React.FC<IHexColorInputProps> = ({ label, color, onChange }) => {
  const [isPickerVisible, setPickerVisible] = React.useState<boolean>(false);
  const [draft, setDraft] = React.useState<string>(color);

  React.useEffect(() => {
    setDraft(color);
  }, [color]);

  const handleHexChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    if (!newValue) {
      setDraft('');
      return;
    }
    const normalized = normalizeHex(newValue);
    setDraft(normalized);
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      onChange(normalized);
    }
  };

  const handlePickerChange = (_: React.SyntheticEvent<HTMLElement>, colorObj: IColor): void => {
    setDraft(colorObj.hex);
    onChange(colorObj.hex);
  };

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
        <TextField
          styles={{ fieldGroup: { width: 120 } }}
          value={draft}
          onChange={handleHexChange}
          placeholder="#000000"
        />
        <DefaultButton
          iconProps={{ iconName: 'Color' }}
          onClick={() => setPickerVisible((visible) => !visible)}
          text={isPickerVisible ? 'Hide' : 'Pick'}
        />
      </Stack>
      {isPickerVisible && (
        <div style={{ marginTop: 12 }}>
          <ColorPicker
            color={color || '#000000'}
            alphaType="none"
            onChange={handlePickerChange}
          />
        </div>
      )}
    </div>
  );
};

export default HexColorInput;
