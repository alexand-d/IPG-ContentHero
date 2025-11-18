import { Guid } from '@microsoft/sp-core-library';

export type FontFamilyOption = 'sans' | 'montserrat';

export interface IFontSettings {
  family: FontFamilyOption;
  size: number;
}

export interface ICoordinateControl {
  x: number;
  y: number;
}

export interface ISizeControl {
  width: number;
  height: number;
}

export interface IStoryCard {
  id: string;
  title: string;
  content: string;
  bullets: string[];
  accentColor: string;
  image: {
    url: string;
    altText: string;
    singleCorner: boolean;
    position: ICoordinateControl;
    size: ISizeControl;
  };
  textFrame: {
    position: ICoordinateControl;
    size: ISizeControl;
    titleFont: IFontSettings;
    bodyFont: IFontSettings;
    bulletFont: IFontSettings;
  };
}

const defaultStories = [
  {
    title: 'Introducing the Next Generation of High-Power Fiber Lasers',
    content:
      'Continuous improvements to our laser architecture have led to the highest performance high-power fiber lasers yet.',
    bullets: [
      'Unmatched power-to-footprint ratio',
      'Industry-leading energy efficiency',
      'Improved optical reliability and back reflection protection',
      'Increased process flexibility'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    imageAlt: 'Product line of high power fiber lasers'
  },
  {
    title: 'Our Mission is to Deliver Lasers That Meet Your Needs',
    content:
      'Every system is configured for your process with engineering support that travels from the factory to your production line.',
    bullets: [
      'Customized beam modes matched to your requirements',
      'Flexible fiber delivery for easy process integration',
      'Time & energy sharing maximizes laser utilization',
      'Cooling flexibility for any environment'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    imageAlt: 'Close up of fiber-optic connectors'
  }
];

const newStory = (index: number): IStoryCard => ({
  id: Guid.newGuid().toString(),
  title: defaultStories[index]?.title ?? 'New story title',
  content:
    defaultStories[index]?.content ??
    'Use the configuration panel to provide an overview for this story card.',
  bullets:
    defaultStories[index]?.bullets?.slice() ?? [
      'Add a benefit',
      'Add a differentiator'
    ],
  accentColor: '#f26c2b',
  image: {
    url: defaultStories[index]?.imageUrl ?? '',
    altText: defaultStories[index]?.imageAlt ?? 'Story image',
    singleCorner: index % 2 === 1,
    position: {
      x: 0,
      y: 0
    },
    size: {
      width: 100,
      height: 360
    }
  },
  textFrame: {
    position: {
      x: 0,
      y: 0
    },
    size: {
      width: 100,
      height: 240
    },
    titleFont: {
      family: 'montserrat',
      size: 28
    },
    bodyFont: {
      family: 'sans',
      size: 16
    },
    bulletFont: {
      family: 'sans',
      size: 15
    }
  }
});

export const createStoryTemplate = (index: number = 0): IStoryCard => newStory(index);

export const getDefaultStories = (): IStoryCard[] => [
  createStoryTemplate(0),
  createStoryTemplate(1)
];
