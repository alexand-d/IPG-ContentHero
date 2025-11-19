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

export interface IFrameSettings {
  position: ICoordinateControl;
  size: ISizeControl;
}

export interface IStoryTextFrame extends IFrameSettings {
  titleFont: IFontSettings;
  bodyFont: IFontSettings;
  bulletFont: IFontSettings;
}

export interface IStoryCard {
  id: string;
  title: string;
  content: string;
  bullets: string[];
  accentColor: string;
  showBullets: boolean;
  titleRichText?: string;
  bodyRichText?: string;
  bulletsRichText?: string;
  image: {
    url: string;
    altText: string;
    singleCorner: boolean;
    cornerReversed: boolean;
    position: ICoordinateControl;
    size: ISizeControl;
  };
  textFrame: IStoryTextFrame;
  hoverEffects: {
    text: boolean;
    image: boolean;
  };
}

const toParagraph = (value: string): string => `<p>${value}</p>`;

const listToHtml = (items: string[]): string =>
  `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;

const defaultStories = [
  {
    title: 'Lorem ipsum dolor sit amet',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum nisl ut viverra fringilla.',
    bullets: [
      'Curabitur vehicula erat eget urna aliquet',
      'Sed venenatis nibh in elementum laoreet',
      'Morbi vitae orci eget neque lobortis',
      'Duis luctus mi a ultrices faucibus'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    imageAlt: 'Technology detail showing lorem ipsum art'
  },
  {
    title: 'Consectetur adipiscing elit lorem',
    content:
      'Integer at lacus tempus, ultricies neque id, interdum nibh. Aliquam erat volutpat, vivamus at ligula.',
    bullets: [
      'Praesent nec risus ac nulla gravida',
      'Suspendisse potenti vivamus porta',
      'Donec id libero sed justo gravida',
      'Cras convallis ex vitae dui porta'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    imageAlt: 'Abstract industrial lorem ipsum detail'
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
  showBullets: true,
  titleRichText: toParagraph(defaultStories[index]?.title ?? 'New story title'),
  bodyRichText: toParagraph(
    defaultStories[index]?.content ??
      'Use the configuration panel to provide an overview for this story card.'
  ),
  bulletsRichText: listToHtml(
    defaultStories[index]?.bullets?.slice() ?? ['Add a benefit', 'Add a differentiator']
  ),
  image: {
    url: defaultStories[index]?.imageUrl ?? '',
    altText: defaultStories[index]?.imageAlt ?? 'Story image',
    singleCorner: index % 2 === 1,
    cornerReversed: false,
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
  },
  hoverEffects: {
    text: false,
    image: false
  }
});

export const createStoryTemplate = (index: number = 0): IStoryCard => newStory(index);

export const getDefaultStories = (): IStoryCard[] => [
  createStoryTemplate(0),
  createStoryTemplate(1)
];
