import { IStoryCard } from './StoryModels';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IIpgContentheroProps {
  stories: IStoryCard[];
  isEditMode: boolean;
  onUpdateStories: (stories: IStoryCard[]) => void;
  backgroundColor: string;
  context: WebPartContext;
}
