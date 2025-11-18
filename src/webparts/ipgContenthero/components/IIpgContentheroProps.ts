import { IStoryCard } from './StoryModels';

export interface IIpgContentheroProps {
  stories: IStoryCard[];
  isEditMode: boolean;
  onUpdateStories: (stories: IStoryCard[]) => void;
}
