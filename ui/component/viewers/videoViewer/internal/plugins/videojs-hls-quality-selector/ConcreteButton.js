import videojs from 'video.js';
import { toCapitalCase } from 'util/string';

const VideoJsButtonClass = videojs.getComponent('MenuButton');
const VideoJsMenuClass = videojs.getComponent('Menu');
const VideoJsComponent = videojs.getComponent('Component');
const Dom = videojs.dom;

/**
 * Extend vjs button class for quality button.
 */
export default class ConcreteButton extends VideoJsButtonClass {
  /**
   * Button constructor.
   *
   * @param {Player} player - videojs player instance
   */
  constructor(player) {
    super(player, {
      title: player.localize('Quality'),
      name: 'QualityButton',
    });
  }

  /**
   * Creates button items.
   *
   * @return {Array} - Button items
   */
  createItems() {
    return [];
  }

  /**
   * Create the menu and add all items to it.
   *
   * @return {Menu}
   *         The constructed menu
   */
  createMenu() {
    const menu = new VideoJsMenuClass(this.player_, { menuButton: this });

    this.hideThreshold_ = 0;

    // Add a title list item to the top
    if (this.options_.title) {
      const titleEl = Dom.createEl('li', {
        className: 'vjs-menu-title',
        innerHTML: toCapitalCase(this.options_.title),
        tabIndex: -1,
      });
      const titleComponent = new VideoJsComponent(this.player_, { el: titleEl });

      this.hideThreshold_ += 1;

      menu.addItem(titleComponent);
    }

    this.items = this.createItems();

    if (this.items) {
      // Add menu items to the menu
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  }
}
