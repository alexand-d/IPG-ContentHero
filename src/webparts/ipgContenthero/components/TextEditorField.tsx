import * as React from 'react';
import {
  Dropdown,
  IconButton,
  IDropdownOption,
  Label,
  Stack,
  TooltipHost
} from '@fluentui/react';
import HexColorInput from './HexColorInput';
import styles from './TextEditorField.module.scss';

const headingOptions: IDropdownOption<string>[] = [
  { key: 'p', text: 'Normal text' },
  { key: 'h2', text: 'Heading 2' },
  { key: 'h3', text: 'Heading 3' },
  { key: 'h4', text: 'Heading 4' }
];

export interface ITextEditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  color: string;
  onColorChange: (color: string) => void;
}

const TextEditorField: React.FC<ITextEditorFieldProps> = ({
  label,
  value,
  onChange,
  color,
  onColorChange
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, arg?: string): void => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
  };

  const handleInput = (): void => {
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const handleBlockChange = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<string>): void => {
    if (option) {
      exec('formatBlock', option.key as string);
    }
  };

  const handleLink = (): void => {
    const url = prompt('Enter a URL');
    if (url) {
      exec('createLink', url);
    }
  };

  const renderToolbarButton = (iconName: string, title: string, onClick: () => void): React.ReactElement => (
    <TooltipHost content={title} key={title}>
      <IconButton
        className={styles.toolbarButton}
        iconProps={{ iconName }}
        onClick={onClick}
      />
    </TooltipHost>
  );

  return (
    <div className={styles.editorContainer}>
      <Label>{label}</Label>
      <div className={styles.toolbar}>
        <Dropdown
          options={headingOptions}
          placeholder="Normal text"
          selectedKey={undefined}
          onChange={handleBlockChange}
          styles={{ dropdown: { width: 140 } }}
        />
        <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
          {renderToolbarButton('Bold', 'Bold', () => exec('bold'))}
          {renderToolbarButton('Italic', 'Italic', () => exec('italic'))}
          {renderToolbarButton('Underline', 'Underline', () => exec('underline'))}
          {renderToolbarButton('BulletedList', 'Bulleted list', () => exec('insertUnorderedList'))}
          {renderToolbarButton('NumberedList', 'Numbered list', () => exec('insertOrderedList'))}
          {renderToolbarButton('AlignLeft', 'Align left', () => exec('justifyLeft'))}
          {renderToolbarButton('AlignCenter', 'Align center', () => exec('justifyCenter'))}
          {renderToolbarButton('AlignRight', 'Align right', () => exec('justifyRight'))}
          {renderToolbarButton('Link', 'Insert link', handleLink)}
          {renderToolbarButton('RemoveLink', 'Remove link', () => exec('unlink'))}
        </Stack>
      </div>
      <div
        className={styles.editorSurface}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      />
      <div className={styles.colorRow}>
        <HexColorInput label="Font color" color={color} onChange={onColorChange} />
      </div>
    </div>
  );
};

export default TextEditorField;
