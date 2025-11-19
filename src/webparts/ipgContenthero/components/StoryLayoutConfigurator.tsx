import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  Slider,
  Stack,
  Toggle
} from '@fluentui/react';
import styles from './IpgContenthero.module.scss';
import { FontFamilyOption, IStoryCard } from './StoryModels';

export interface IStoryLayoutConfiguratorProps {
  stories: IStoryCard[];
  onChange: (stories: IStoryCard[]) => void;
}

const fontOptions: IDropdownOption<FontFamilyOption>[] = [
  { key: 'sans', text: 'Sans Regular' },
  { key: 'montserrat', text: 'Montserrat Bold' }
];

const StoryLayoutConfigurator: React.FC<IStoryLayoutConfiguratorProps> = ({
  stories,
  onChange
}) => {
  const [activeId, setActiveId] = React.useState<string>(stories?.[0]?.id);

  React.useEffect(() => {
    let exists = false;
    for (const story of stories) {
      if (story.id === activeId) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      setActiveId(stories[0]?.id);
    }
  }, [stories, activeId]);

  const updateStory = (id: string, updater: (story: IStoryCard) => IStoryCard): void => {
    const updated = stories.map((story) => (story.id === id ? updater(story) : story));
    onChange(updated);
  };

  const getActiveStory = (): IStoryCard | undefined => {
    for (const story of stories) {
      if (story.id === activeId) {
        return story;
      }
    }
    return undefined;
  };

  const activeStory = getActiveStory();

  if (!activeStory) {
    return <div className={styles.storyEditorPlaceholder}>Add stories to configure layout.</div>;
  }

  return (
    <div className={styles.layoutConfigurator}>
      <div className={styles.storyList}>
        {stories.map((story, index) => (
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
                {story.title || `Story ${index + 1}`}
              </span>
              <span className={styles.storyListSubtitle}>#{index + 1}</span>
            </div>
          </button>
        ))}
      </div>
      <div className={styles.storyEditor}>
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
        {activeStory.image.singleCorner && (
          <Toggle
            label="Reverse corner orientation"
            checked={activeStory.image.cornerReversed}
            onChange={(_, checked) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                image: {
                  ...story.image,
                  cornerReversed: !!checked
                }
              }))
            }
          />
        )}
        <Stack tokens={{ childrenGap: 12 }}>
          <Slider
            label="Image X offset"
            min={-120}
            max={120}
            value={activeStory.image.position.x}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                image: {
                  ...story.image,
                  position: { ...story.image.position, x: value }
                }
              }))
            }
          />
          <Slider
            label="Image Y offset"
            min={-120}
            max={120}
            value={activeStory.image.position.y}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                image: {
                  ...story.image,
                  position: { ...story.image.position, y: value }
                }
              }))
            }
          />
          <Slider
            label="Image width (%)"
            min={40}
            max={120}
            value={activeStory.image.size.width}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                image: {
                  ...story.image,
                  size: { ...story.image.size, width: value }
                }
              }))
            }
          />
          <Slider
            label="Image height (px)"
            min={200}
            max={640}
            value={activeStory.image.size.height}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                image: {
                  ...story.image,
                  size: { ...story.image.size, height: value }
                }
              }))
            }
          />
        </Stack>
        <Stack tokens={{ childrenGap: 12 }}>
          <Slider
            label="Text X offset"
            min={-120}
            max={120}
            value={activeStory.textFrame.position.x}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  position: { ...story.textFrame.position, x: value }
                }
              }))
            }
          />
          <Slider
            label="Text Y offset"
            min={-120}
            max={120}
            value={activeStory.textFrame.position.y}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  position: { ...story.textFrame.position, y: value }
                }
              }))
            }
          />
          <Slider
            label="Text width (%)"
            min={50}
            max={120}
            value={activeStory.textFrame.size.width}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  size: { ...story.textFrame.size, width: value }
                }
              }))
            }
          />
          <Slider
            label="Text minimum height (px)"
            min={160}
            max={600}
            value={activeStory.textFrame.size.height}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  size: { ...story.textFrame.size, height: value }
                }
              }))
            }
          />
        </Stack>
        <Stack tokens={{ childrenGap: 12 }}>
          <Dropdown
            label="Title font"
            options={fontOptions}
            selectedKey={activeStory.textFrame.titleFont.family}
            onChange={(_, option) =>
              option &&
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  titleFont: {
                    ...story.textFrame.titleFont,
                    family: option.key as FontFamilyOption
                  }
                }
              }))
            }
          />
          <Slider
            label="Title font size"
            min={18}
            max={48}
            value={activeStory.textFrame.titleFont.size}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  titleFont: { ...story.textFrame.titleFont, size: value }
                }
              }))
            }
          />
          <Dropdown
            label="Body font"
            options={fontOptions}
            selectedKey={activeStory.textFrame.bodyFont.family}
            onChange={(_, option) =>
              option &&
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  bodyFont: {
                    ...story.textFrame.bodyFont,
                    family: option.key as FontFamilyOption
                  }
                }
              }))
            }
          />
          <Slider
            label="Body font size"
            min={12}
            max={32}
            value={activeStory.textFrame.bodyFont.size}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  bodyFont: { ...story.textFrame.bodyFont, size: value }
                }
              }))
            }
          />
          <Dropdown
            label="Bullet font"
            options={fontOptions}
            selectedKey={activeStory.textFrame.bulletFont.family}
            onChange={(_, option) =>
              option &&
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  bulletFont: {
                    ...story.textFrame.bulletFont,
                    family: option.key as FontFamilyOption
                  }
                }
              }))
            }
          />
          <Slider
            label="Bullet font size"
            min={11}
            max={30}
            value={activeStory.textFrame.bulletFont.size}
            showValue
            onChange={(value) =>
              updateStory(activeStory.id, (story) => ({
                ...story,
                textFrame: {
                  ...story.textFrame,
                  bulletFont: { ...story.textFrame.bulletFont, size: value }
                }
              }))
            }
          />
        </Stack>
        <Toggle
          label="Image hover effect"
          checked={activeStory.hoverEffects?.image}
          onChange={(_, checked) =>
            updateStory(activeStory.id, (story) => ({
              ...story,
              hoverEffects: {
                ...story.hoverEffects,
                image: !!checked
              }
            }))
          }
        />
        <Toggle
          label="Text hover effect"
          checked={activeStory.hoverEffects?.text}
          onChange={(_, checked) =>
            updateStory(activeStory.id, (story) => ({
              ...story,
              hoverEffects: {
                ...story.hoverEffects,
                text: !!checked
              }
            }))
          }
        />
      </div>
    </div>
  );
};

export default StoryLayoutConfigurator;
