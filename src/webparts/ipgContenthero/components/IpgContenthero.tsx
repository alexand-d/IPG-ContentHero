import * as React from 'react';
import { DefaultButton } from '@fluentui/react';
import styles from './IpgContenthero.module.scss';
import type { IIpgContentheroProps } from './IIpgContentheroProps';
import { FontFamilyOption, IStoryCard } from './StoryModels';
import StoryManagerPanel from './StoryManagerPanel';

type HoverStyle = React.CSSProperties & { [key: string]: string | number | undefined };

const fontFamilyMap: Record<FontFamilyOption, string> = {
  sans: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  montserrat: '"Montserrat", "Segoe UI", sans-serif'
};

const ensureRichText = (value?: string, fallback?: string): string => {
  if (value && value.trim().length > 0) {
    return value;
  }
  if (!fallback) {
    return '';
  }
  return `<p>${fallback}</p>`;
};

const hexToRgba = (hex: string, opacity: number): string => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3
    ? normalized
        .split('')
        .map((char) => `${char}${char}`)
        .join('')
    : normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const buildShadow = (blur: number, color: string, opacity: number): string => {
  const offset = Math.max(Math.round(blur / 3), 8);
  return `0 ${offset}px ${Math.max(blur, 5)}px ${hexToRgba(color, opacity)}`;
};

const getBulletMarkup = (story: IStoryCard): string => {
  const fallbackList = `<ul>${story.bullets
    .map((bullet) => `<li>${bullet}</li>`)
    .join('')}</ul>`;

  if (story.showBullets) {
    return ensureRichText(story.bulletsRichText, fallbackList);
  }

  const fallbackText = story.bullets.map((bullet) => `<p>${bullet}</p>`).join('');
  if (story.bulletsRichText) {
    return story.bulletsRichText
      .replace(/<\/?ul[^>]*>/gi, '')
      .replace(/<li[^>]*>/gi, '<p>')
      .replace(/<\/li>/gi, '</p>');
  }

  return fallbackText;
};

const IpgContenthero: React.FC<IIpgContentheroProps> = ({
  stories,
  isEditMode,
  onUpdateStories,
  backgroundColor,
  context
}) => {
  const [isPanelOpen, setIsPanelOpen] = React.useState<boolean>(false);

  const textStyle = (story: IStoryCard): React.CSSProperties => ({
    maxWidth: `${story.textFrame.size.width}%`,
    minHeight: `${story.textFrame.size.height}px`,
    transform: `translate(${story.textFrame.position.x}px, ${story.textFrame.position.y}px)`
  });

  const imageFrameStyle = (story: IStoryCard): React.CSSProperties => ({
    width: `${story.image.size.width}%`,
    height: `${story.image.size.height}px`,
    transform: `translate(${story.image.position.x}px, ${story.image.position.y}px)`
  });

  const renderStory = (story: IStoryCard, index: number): React.ReactElement => {
    const isImageLeft = index % 2 === 1;
    const textHoverConfig = story.hoverEffects?.text;
    const imageHoverConfig = story.hoverEffects?.image;
    const columnStyle: HoverStyle = {
      ...textStyle(story)
    };
    if (textHoverConfig) {
      columnStyle['--textHoverDuration'] = `${textHoverConfig.duration}ms`;
      columnStyle['--textHoverShadow'] = buildShadow(
        textHoverConfig.shadow.blur,
        textHoverConfig.shadow.color,
        textHoverConfig.shadow.opacity
      );
    }
    const imageStyleProps: HoverStyle = {
      ...imageFrameStyle(story)
    };
    if (imageHoverConfig) {
      imageStyleProps['--imageHoverDuration'] = `${imageHoverConfig.duration}ms`;
      imageStyleProps['--imageHoverShadow'] = buildShadow(
        imageHoverConfig.shadow.blur,
        imageHoverConfig.shadow.color,
        imageHoverConfig.shadow.opacity
      );
    }
    const textColumnClass = [
      styles.storyColumn,
      textHoverConfig?.enabled ? styles.textHoverEnabled : ''
    ]
      .filter(Boolean)
      .join(' ');
    const bulletClass = [
      styles.storyBullets,
      story.showBullets ? '' : styles.bulletsAsText
    ]
      .filter(Boolean)
      .join(' ');
    const imageClassName = [
      styles.storyImage,
      story.image.singleCorner
        ? story.image.cornerReversed
          ? styles.singleCornerRight
          : styles.singleCornerLeft
        : '',
      imageHoverConfig?.enabled ? styles.imageHoverEnabled : ''
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <article
        key={story.id}
        className={`${styles.storyRow} ${isImageLeft ? styles.reversed : ''}`}
      >
        <div className={textColumnClass} style={columnStyle}>
          <div
            className={styles.storyTitle}
            style={{
              fontFamily: fontFamilyMap[story.textFrame.titleFont.family],
              fontSize: story.textFrame.titleFont.size,
              color: story.textColors?.title || '#041c3d'
            }}
            dangerouslySetInnerHTML={{
              __html: ensureRichText(story.titleRichText, story.title)
            }}
          />
          <div
            className={styles.storyBody}
            style={{
              fontFamily: fontFamilyMap[story.textFrame.bodyFont.family],
              fontSize: story.textFrame.bodyFont.size,
              color: story.textColors?.body || '#667085'
            }}
            dangerouslySetInnerHTML={{
              __html: ensureRichText(story.bodyRichText, story.content)
            }}
          />
          <div
            className={bulletClass}
            style={{
              '--accentColor': story.accentColor,
              fontFamily: fontFamilyMap[story.textFrame.bulletFont.family],
              fontSize: story.textFrame.bulletFont.size,
              color: story.textColors?.bullets || '#1c2c4d'
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{
              __html: getBulletMarkup(story)
            }}
          />
        </div>
        <div className={styles.storyColumn}>
          <div
            className={imageClassName}
            style={imageStyleProps}
          >
            {story.image.url ? (
              <img src={story.image.url} alt={story.image.altText} />
            ) : (
              <div className={styles.placeholder}>
                Upload an image for this story
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className={styles.ipgContenthero} style={{ background: backgroundColor }}>
      <div className={styles.sectionContent}>
        {isEditMode && (
          <div className={styles.toolbar}>
            <DefaultButton
              text="Manage stories"
              iconProps={{ iconName: 'Edit' }}
              onClick={() => setIsPanelOpen(true)}
            />
          </div>
        )}
        {stories?.length ? (
          stories.map((story, index) => renderStory(story, index))
        ) : (
          <div className={styles.emptyState}>
            Add a story to start designing the dual feature section.
          </div>
        )}
      </div>
      {isEditMode && (
        <StoryManagerPanel
          isOpen={isPanelOpen}
          stories={stories}
          onDismiss={() => setIsPanelOpen(false)}
          context={context}
          onSave={(updatedStories) => {
            onUpdateStories(updatedStories);
            setIsPanelOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default IpgContenthero;
