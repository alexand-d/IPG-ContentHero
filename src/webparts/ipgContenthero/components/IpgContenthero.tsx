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
    return (
      <article
        key={story.id}
        className={`${styles.storyRow} ${isImageLeft ? styles.reversed : ''}`}
      >
        <div className={styles.storyColumn} style={textStyle(story)}>
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
            className={`${styles.storyBullets} ${
              story.showBullets ? '' : styles.bulletsAsText
            }`}
            style={{
              '--accentColor': story.accentColor,
              fontFamily: fontFamilyMap[story.textFrame.bulletFont.family],
              fontSize: story.textFrame.bulletFont.size
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{
              __html: ensureRichText(
                story.bulletsRichText,
                `<ul>${story.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>`
              )
            }}
          />
        </div>
        <div className={styles.storyColumn}>
          <div
            className={`${styles.storyImage} ${
              story.image.singleCorner ? styles.singleCorner : ''
            }`}
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
