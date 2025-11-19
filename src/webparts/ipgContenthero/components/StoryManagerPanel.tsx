import * as React from 'react';
import {
  DefaultButton,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  TextField,
  Toggle
} from '@fluentui/react';
import styles from './IpgContenthero.module.scss';
import { createStoryTemplate, IStoryCard } from './StoryModels';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import type { BaseComponentContext as LegacyBaseComponentContext } from '@pnp/spfx-controls-react/node_modules/@microsoft/sp-component-base';
import TextEditorField from './TextEditorField';

export interface IStoryManagerPanelProps {
  isOpen: boolean;
  stories: IStoryCard[];
  onDismiss: () => void;
  onSave: (stories: IStoryCard[]) => void;
  context: WebPartContext;
}

const stripHtml = (value?: string): string =>
  (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractListItems = (html: string): string[] => {
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
  if (matches && matches.length) {
    return matches.map((item) => stripHtml(item)).filter(Boolean);
  }

  return stripHtml(html)
    .split(/\n|\. /)
    .map((item) => item.trim())
    .filter(Boolean);
};

const ImagePicker: React.FC<{
  storyId: string;
  imageUrl: string;
  context: WebPartContext;
  onChange: (storyId: string, newUrl: string) => void;
}> = ({ storyId, imageUrl, context, onChange }) => {
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
    <>
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
      <FilePicker
        buttonLabel="Use SharePoint stock image"
        accepts={['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']}
        context={context as unknown as LegacyBaseComponentContext}
        hideWebSearchTab
        hideRecentTab
        onSave={(results: IFilePickerResult | IFilePickerResult[]) => {
          const resultList = Array.isArray(results) ? results : [results];
          const first = resultList[0];
          if (first) {
            if (first.fileAbsoluteUrl) {
              onChange(storyId, first.fileAbsoluteUrl);
            } else if (first.previewDataUrl) {
              onChange(storyId, first.previewDataUrl);
            }
          }
        }}
        onChange={(): void => undefined}
      />
    </>
  );
};

const StoryManagerPanel: React.FC<IStoryManagerPanelProps> = ({
  isOpen,
  stories,
  onDismiss,
  onSave,
  context
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
            <span className={styles.storyListTitle}>
              {stripHtml(story.titleRichText || story.title) || `Story ${index + 1}`}
            </span>
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

  const panelBody = activeStory ? (
    <div className={styles.storyEditor}>
      <TextEditorField
        label="Story title"
        value={activeStory.titleRichText || ''}
        onChange={(value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            titleRichText: value,
            title: stripHtml(value) || story.title
          }))
        }
        color={activeStory.textColors?.title || '#041c3d'}
        onColorChange={(newColor) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            textColors: {
              ...story.textColors,
              title: newColor
            }
          }))
        }
      />
      <TextEditorField
        label="Body content"
        value={activeStory.bodyRichText || ''}
        onChange={(value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            bodyRichText: value,
            content: stripHtml(value) || story.content
          }))
        }
        color={activeStory.textColors?.body || '#667085'}
        onColorChange={(newColor) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            textColors: {
              ...story.textColors,
              body: newColor
            }
          }))
        }
      />
      <TextEditorField
        label="Bullet points (one per line)"
        value={activeStory.bulletsRichText || ''}
        onChange={(value) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            bulletsRichText: value,
            bullets: extractListItems(value)
          }))
        }
        color={activeStory.textColors?.bullets || '#1c2c4d'}
        onColorChange={(newColor) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            textColors: {
              ...story.textColors,
              bullets: newColor
            }
          }))
        }
      />
      <Toggle
        label="Display bullet points"
        checked={activeStory.showBullets}
        onChange={(_, checked) =>
          updateStory(activeStory.id, (story) => ({
            ...story,
            showBullets: !!checked
          }))
        }
      />
      <ImagePicker
        storyId={activeStory.id}
        imageUrl={activeStory.image.url}
        context={context}
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
