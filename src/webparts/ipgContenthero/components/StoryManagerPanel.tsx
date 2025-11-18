import * as React from 'react';
import {
  DefaultButton,
  Dropdown,
  FontIcon,
  IconButton,
  IDropdownOption,
  Panel,
  PanelType,
  PrimaryButton,
  Slider,
  Stack,
  TextField,
  Toggle
} from '@fluentui/react';
import styles from './IpgContenthero.module.scss';
import {
  createStoryTemplate,
  FontFamilyOption,
  IStoryCard
} from './StoryModels';

export interface IStoryManagerPanelProps {
  isOpen: boolean;
  stories: IStoryCard[];
  onDismiss: () => void;
  onSave: (stories: IStoryCard[]) => void;
}

const fontOptions: IDropdownOption<FontFamilyOption>[] = [
  { key: 'sans', text: 'Sans Regular' },
  { key: 'montserrat', text: 'Montserrat Bold' }
];

const ImagePicker: React.FC<{
  storyId: string;
  imageUrl: string;
  onChange: (storyId: string, newUrl: string) => void;
}> = ({ storyId, imageUrl, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectFile = (): void => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(storyId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.imagePicker}>
      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(_, newValue) => onChange(storyId, newValue || '')}
      />
      <DefaultButton text="Upload image" onClick={handleSelectFile} />
      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

const StoryManagerPanel: React.FC<IStoryManagerPanelProps> = ({
  isOpen,
  stories,
  onDismiss,
  onSave
}) => {
  const [draftStories, setDraftStories] = React.useState<IStoryCard[]>(stories);
  const [activeId, setActiveId] = React.useState<string>(stories?.[0]?.id);

  React.useEffect(() => {
    setDraftStories(stories);
    setActiveId(stories?.[0]?.id);
  }, [stories]);

  const activeStory = React.useMemo<IStoryCard | undefined>(() => {
    for (const story of draftStories) {
      if (story.id === activeId) {
        return story;
      }
    }
    return undefined;
  }, [draftStories, activeId]);

  const updateStory = (
    id: string,
    updater: (story: IStoryCard) => IStoryCard
  ): void => {
    setDraftStories((prev) => prev.map((story) => (story.id === id ? updater(story) : story)));
  };

  const handleAddStory = (): void => {
    const newStory = createStoryTemplate(draftStories.length % 2);
    setDraftStories((prev) => [...prev, newStory]);
    setActiveId(newStory.id);
  };

  const handleDelete = (id: string): void => {
    const updated = draftStories.filter((story) => story.id !== id);
    setDraftStories(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id);
    }
  };

  const handleMove = (index: number, direction: -1 | 1): void => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= draftStories.length) {
      return;
    }
    const updated = [...draftStories];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);
    setDraftStories(updated);
  };

  const handleSave = (): void => {
    onSave(draftStories);
    onDismiss();
  };

  const renderStoryList = (): React.ReactNode => (
    <div className={styles.storyList}>
      {draftStories.map((story, index) => (
        <button
          key={story.id}
          type="button"
          className={`${styles.storyListItem} ${
            story.id === activeId ? styles.storyListItemActive : ''
          }`}
          onClick={() => setActiveId(story.id)}
        >
          <div className={styles.storyListContent}>
            <span className={styles.storyListTitle}>{story.title || `Story ${index + 1}`}</span>
            <span className={styles.storyListSubtitle}>#{index + 1}</span>
          </div>
          <div className={styles.storyListActions}>
            <IconButton
              iconProps={{ iconName: 'ChevronUp' }}
              title="Move up"
              disabled={index === 0}
              onClick={(event) => {
                event.stopPropagation();
                handleMove(index, -1);
              }}
            />
            <IconButton
              iconProps={{ iconName: 'ChevronDown' }}
              title="Move down"
              disabled={index === draftStories.length - 1}
              onClick={(event) => {
                event.stopPropagation();
                handleMove(index, 1);
              }}
            />
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              title="Remove story"
              disabled={draftStories.length <= 1}
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(story.id);
              }}
            />
          </div>
        </button>
      ))}
      <DefaultButton
        iconProps={{ iconName: 'Add' }}
        text="Add story"
        className={styles.addStoryButton}
        onClick={handleAddStory}
      />
    </div>
  );

  const renderTypographyControls = (
    label: string,
    fontSettings: { family: FontFamilyOption; size: number },
    onChange: (font: { family: FontFamilyOption; size: number }) => void
  ): React.ReactNode => (
    <Stack tokens={{ childrenGap: 8 }}>
      <Dropdown
        label={`${label} font`}
        options={fontOptions}
        selectedKey={fontSettings.family}
        onChange={(_, option) =>
          option &&
          onChange({
            ...fontSettings,
            family: option.key as FontFamilyOption
          })
        }
      />
      <Slider
        min={12}
        max={48}
        label={`${label} size`}
        value={fontSettings.size}
        showValue
        onChange={(value) =>
          onChange({
            ...fontSettings,
            size: value
          })
        }
      />
    </Stack>
  );

  const renderPositionControls = (
    label: string,
    position: { x: number; y: number },
    onChange: (coords: { x: number; y: number }) => void
  ): React.ReactNode => (
    <Stack horizontal tokens={{ childrenGap: 12 }}>
      <Slider
        label={`${label} X`}
        min={-120}
        max={120}
        value={position.x}
        showValue
        onChange={(value) =>
          onChange({
            ...position,
            x: value
          })
        }
      />
      <Slider
        label={`${label} Y`}
        min={-120}
        max={120}
        value={position.y}
        showValue
        onChange={(value) =>
          onChange({
            ...position,
            y: value
          })
        }
      />
    </Stack>
  );

  const renderSizeControls = (
    label: string,
    size: { width: number; height: number },
    onChange: (next: { width: number; height: number }) => void,
    widthConfig = { min: 40, max: 120 },
    heightConfig = { min: 160, max: 640 }
  ): React.ReactNode => (
    <Stack horizontal tokens={{ childrenGap: 12 }}>
      <Slider
        label={`${label} width (%)`}
        min={widthConfig.min}
        max={widthConfig.max}
        value={size.width}
        showValue
        onChange={(value) =>
          onChange({
            ...size,
            width: value
          })
        }
      />
      <Slider
        label={`${label} height (px)`}
        min={heightConfig.min}
        max={heightConfig.max}
        value={size.height}
        showValue
        onChange={(value) =>
          onChange({
            ...size,
            height: value
          })
        }
      />
    </Stack>
  );

  const panelBody = activeStory ? (
    <div className={styles.storyEditor}>
      <TextField
        label="Story title"
        value={activeStory.title}
        onChange={(_, value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            title: value || ''
          }))
        }
      />
      <TextField
        label="Body content"
        multiline
        rows={4}
        value={activeStory.content}
        onChange={(_, value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            content: value || ''
          }))
        }
      />
      <TextField
        label="Bullet points (one per line)"
        multiline
        rows={4}
        value={activeStory.bullets.join('\n')}
        onChange={(_, value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            bullets: value ? value.split('\n').map((item) => item.trim()).filter(Boolean) : []
          }))
        }
      />
      <ImagePicker
        storyId={activeStory.id}
        imageUrl={activeStory.image.url}
        onChange={(id, url) =>
          updateStory(id, (story) => ({
            ...story,
            image: {
              ...story.image,
              url
            }
          }))
        }
      />
      <TextField
        label="Image alt text"
        value={activeStory.image.altText}
        onChange={(_, value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            image: {
              ...story.image,
              altText: value || ''
            }
          }))
        }
      />
      <Toggle
        label="Use asymmetric corner highlight"
        checked={activeStory.image.singleCorner}
        onChange={(_, checked) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            image: {
              ...story.image,
              singleCorner: !!checked
            }
          }))
        }
      />
      {renderPositionControls('Image position', activeStory.image.position, (pos) =>
        updateStory(activeStory.id, (story) => ({
          ...story,
          image: {
            ...story.image,
            position: pos
          }
        }))
      )}
      {renderSizeControls(
        'Image size',
        activeStory.image.size,
        (size) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            image: {
              ...story.image,
              size
            }
          })),
        { min: 40, max: 120 },
        { min: 200, max: 640 }
      )}
      {renderPositionControls('Text frame position', activeStory.textFrame.position, (pos) =>
        updateStory(activeStory.id, (story) => ({
          ...story,
          textFrame: {
            ...story.textFrame,
            position: pos
          }
        }))
      )}
      {renderSizeControls(
        'Text frame size',
        activeStory.textFrame.size,
        (size) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            textFrame: {
              ...story.textFrame,
              size
            }
          })),
        { min: 50, max: 120 },
        { min: 160, max: 600 }
      )}
      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <FontIcon iconName="Font" className={styles.fontIcon} />
        <span className={styles.fontSectionLabel}>Typography</span>
      </Stack>
      {renderTypographyControls('Title', activeStory.textFrame.titleFont, (font) =>
        updateStory(activeStory.id, (story) => ({
          ...story,
          textFrame: {
            ...story.textFrame,
            titleFont: font
          }
        }))
      )}
      {renderTypographyControls('Body', activeStory.textFrame.bodyFont, (font) =>
        updateStory(activeStory.id, (story) => ({
          ...story,
          textFrame: {
            ...story.textFrame,
            bodyFont: font
          }
        }))
      )}
      {renderTypographyControls('Bullet', activeStory.textFrame.bulletFont, (font) =>
        updateStory(activeStory.id, (story) => ({
          ...story,
          textFrame: {
            ...story.textFrame,
            bulletFont: font
          }
        }))
      )}
    </div>
  ) : (
    <div className={styles.storyEditorPlaceholder}>Create a story to start editing.</div>
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Manage stories"
      type={PanelType.largeFixed}
      className={styles.storyPanel}
      closeButtonAriaLabel="Close story manager"
      onRenderFooterContent={() => (
        <div className={styles.panelFooter}>
          <PrimaryButton text="Save stories" onClick={handleSave} />
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </div>
      )}
      isFooterAtBottom
    >
      <div className={styles.storyPanelBody}>
        {renderStoryList()}
        {panelBody}
      </div>
    </Panel>
  );
};

export default StoryManagerPanel;
