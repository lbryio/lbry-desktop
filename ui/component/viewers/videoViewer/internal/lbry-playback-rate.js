import videojs from 'video.js';

const IS_DEV = process.env.NODE_ENV !== 'production';
const CONTROL_BAR = 'ControlBar';
const PLAYBACK_RATE_MENU_BUTTON = 'PlaybackRateMenuButton';
const MENU = 'Menu';

const Menu = videojs.getComponent(MENU);
const PlaybackRateMenuButton = videojs.getComponent(PLAYBACK_RATE_MENU_BUTTON);

class LbryPlaybackRateMenuButton extends PlaybackRateMenuButton {
  static replaceExisting(player) {
    try {
      const controlBar = player.getChild(CONTROL_BAR);
      const playbackRateMenuButton = controlBar.getChild(PLAYBACK_RATE_MENU_BUTTON);
      controlBar.removeChild(playbackRateMenuButton);
      controlBar.addChild(new LbryPlaybackRateMenuButton(player));
    } catch (error) {
      if (IS_DEV) throw Error('\n\nvideojs.jsx: Playback rate hierarchy changed?\n\n' + error);
    }
  }

  constructor(player, options = {}) {
    super(player, options);
  }

  /**
   * The default behavior cycles through the selection, while the popup is
   * invoked by hover. We have removed the hover behavior (1637) since it is
   * annoying when accidentally hovered, and it's also needed to address a
   * z-order issue.
   *
   * With the hover behavior gone, we need to override the default click
   * behavior to invoke the popup instead of cycling through the settings.
   *
   * Ref: https://github.com/videojs/video.js/issues/3394#issuecomment-230793773
   * @param event
   */
  handleClick(event) {
    if (this.buttonPressed_) {
      this.unpressButton();
    } else {
      this.pressButton();
    }
  }

  /**
   * The default menu behavior is to dismiss the popup when losing focus, unless
   * the new focus is on the associated button. The associated button is
   * specifically defined as the first child, but PlaybackRateMenuButton
   * implements it as the second child.
   *
   * Fixed by reversing the check to use `relatedTarget.parentElement` instead.
   * It shouldn't matter which sub-element was clicked, as long as it's part of
   * the button.
   *
   * @param event
   * @param menu
   */
  handleMenuBlur(event, menu) {
    const relatedTarget = event.relatedTarget || document.activeElement;

    if (
      !menu.children().some((element) => {
        return element.el() === relatedTarget;
      })
    ) {
      const btn = menu.menuButton_;
      if (btn && btn.buttonPressed_ && relatedTarget.parentElement !== btn.el()) {
        btn.unpressButton();
      }
    }
  }

  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });

    // Override the original with ours. Must be done after the constructor
    // is called, as that is where `boundHandleBlur_` is originally set.
    menu.boundHandleBlur_ = (e) => this.handleMenuBlur(e, menu);

    this.hideThreshold_ = 0; // Must reset. See `MenuButton::createMenu` notes.
    this.items = this.createItems();

    if (this.items) {
      for (let i = 0; i < this.items.length; ++i) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  }
}

export default LbryPlaybackRateMenuButton;
