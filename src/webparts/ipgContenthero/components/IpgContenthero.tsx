import * as React from 'react';
import { DefaultButton } from '@fluentui/react';
import styles from './IpgContenthero.module.scss';
import type { IIpgContentheroProps } from './IIpgContentheroProps';
import { FontFamilyOption, IStoryCard } from './StoryModels';
import StoryManagerPanel from './StoryManagerPanel';

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
    const textColumnClass = [
      styles.storyColumn,
      story.hoverEffects?.text ? styles.textHoverEnabled : ''
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
      story.hoverEffects?.image ? styles.imageHoverEnabled : ''
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <article
        key={story.id}
        className={`${styles.storyRow} ${isImageLeft ? styles.reversed : ''}`}
      >
        <div className={textColumnClass} style={textStyle(story)}>
          <div
            className={styles.storyTitle}
            style={{
              fontFamily: fontFamilyMap[story.textFrame.titleFont.family],
              fontSize: story.textFrame.titleFont.size
            }}
            dangerouslySetInnerHTML={{
              __html: ensureRichText(story.titleRichText, story.title)
            }}
          />
          <div
            className={styles.storyBody}
            style={{
              fontFamily: fontFamilyMap[story.textFrame.bodyFont.family],
              fontSize: story.textFrame.bodyFont.size
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
              fontSize: story.textFrame.bulletFont.size
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{
              __html: getBulletMarkup(story)
            }}
          />
        </div>
        <div className={styles.storyColumn}>
          <div
            className={imageClassName}
            style={imageFrameStyle(story)}
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
