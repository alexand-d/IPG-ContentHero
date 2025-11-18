import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneLabel
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as strings from 'IpgContentheroWebPartStrings';
import IpgContenthero from './components/IpgContenthero';
import { IIpgContentheroProps } from './components/IIpgContentheroProps';
import { getDefaultStories, IStoryCard } from './components/StoryModels';

export interface IIpgContentheroWebPartProps {
  stories: IStoryCard[];
}

export default class IpgContentheroWebPart extends BaseClientSideWebPart<IIpgContentheroWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIpgContentheroProps> = React.createElement(
      IpgContenthero,
      {
        stories: this.properties.stories ?? [],
        isEditMode: this.displayMode === DisplayMode.Edit,
        onUpdateStories: this._handleStoriesUpdate
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    if (!this.properties.stories || this.properties.stories.length === 0) {
      this.properties.stories = getDefaultStories();
    }
    SPComponentLoader.loadCss('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
    return Promise.resolve();
  }

  private readonly _handleStoriesUpdate = (stories: IStoryCard[]): void => {
    this.properties.stories = stories;
    this.render();
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneLabel('', {
                  text: 'Use the Manage stories button inside the web part to change the content.'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
