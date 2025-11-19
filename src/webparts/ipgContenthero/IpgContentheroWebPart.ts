import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneLabel,
  IPropertyPaneField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as strings from 'IpgContentheroWebPartStrings';
import IpgContenthero from './components/IpgContenthero';
import { IIpgContentheroProps } from './components/IIpgContentheroProps';
import { getDefaultStories, IStoryCard } from './components/StoryModels';
import StoryLayoutConfigurator from './components/StoryLayoutConfigurator';
import BackgroundColorPicker from './components/BackgroundColorPicker';

interface ICustomFieldProps {
  key: string;
  onRender: (element: HTMLElement) => void;
  onDispose: (element: HTMLElement) => void;
}

/* eslint-disable @typescript-eslint/no-var-requires */
const PropertyPaneCustomField: (
  props: ICustomFieldProps
) => IPropertyPaneField<ICustomFieldProps> =
  require('@microsoft/sp-property-pane/lib-commonjs/propertyPaneFields/propertyPaneCustomField/PropertyPaneCustomField')
    .PropertyPaneCustomField;
/* eslint-enable @typescript-eslint/no-var-requires */

export interface IIpgContentheroWebPartProps {
  stories: IStoryCard[];
  backgroundColor?: string;
}

export default class IpgContentheroWebPart extends BaseClientSideWebPart<IIpgContentheroWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIpgContentheroProps> = React.createElement(
      IpgContenthero,
      {
        stories: this.properties.stories ?? [],
        isEditMode: this.displayMode === DisplayMode.Edit,
        onUpdateStories: this._handleStoriesUpdate,
        backgroundColor: this.properties.backgroundColor || '#f7f9fb',
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    if (!this.properties.stories || this.properties.stories.length === 0) {
      this.properties.stories = getDefaultStories();
    }
    if (!this.properties.backgroundColor) {
      this.properties.backgroundColor = '#f7f9fb';
    }
    SPComponentLoader.loadCss('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
    return Promise.resolve();
  }

  private readonly _handleStoriesUpdate = (stories: IStoryCard[]): void => {
    this.properties.stories = stories;
    if (this.context.propertyPane.isPropertyPaneOpen()) {
      this.context.propertyPane.refresh();
    }
    this.render();
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const layoutField: IPropertyPaneField<ICustomFieldProps> = PropertyPaneCustomField({
      key: 'storyLayoutConfigurator',
      onRender: (domElement: HTMLElement) => {
        const element = React.createElement(StoryLayoutConfigurator, {
          stories: this.properties.stories ?? [],
          onChange: this._handleStoriesUpdate
        });
        ReactDom.render(element, domElement);
      },
      onDispose: (domElement: HTMLElement) => {
        ReactDom.unmountComponentAtNode(domElement);
      }
    });

    const colorField: IPropertyPaneField<ICustomFieldProps> = PropertyPaneCustomField({
      key: 'backgroundColorPicker',
      onRender: (domElement: HTMLElement) => {
        const element = React.createElement(BackgroundColorPicker, {
          color: this.properties.backgroundColor || '#f7f9fb',
          onChange: (newColor: string) => {
            this.properties.backgroundColor = newColor;
            this.render();
          }
        });
        ReactDom.render(element, domElement);
      },
      onDispose: (domElement: HTMLElement) => {
        ReactDom.unmountComponentAtNode(domElement);
      }
    });

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
                }),
                colorField,
                layoutField
              ]
            }
          ]
        }
      ]
    };
  }
}
