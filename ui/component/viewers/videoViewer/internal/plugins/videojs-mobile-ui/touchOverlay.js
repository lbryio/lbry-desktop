/**
 * @file touchOverlay.js
 * Touch UI component
 */

import videojs from 'video.js';
import window from 'global/window';

const Component = videojs.getComponent('Component');
const dom = videojs.dom || videojs;

/**
 * The `TouchOverlay` is an overlay to capture tap events.
 *
 * @extends Component
 */
class TouchOverlay extends Component {
  /**
   * Creates an instance of the this class.
   *
   * @param  {Player} player
   *         The `Player` that this class should be attached to.
   *
   * @param  {Object} [options]
   *         The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);

    this.seekSeconds = options.seekSeconds;
    this.tapTimeout = options.tapTimeout;

    // Add play toggle overlay
    this.addChild('playToggle', {});

    // Clear overlay when playback starts or with control fade
    player.on(['playing', 'userinactive'], e => {
      if (!this.player_.paused()) {
        this.removeClass('show-play-toggle');
      }
    });

    // A 0 inactivity timeout won't work here
    if (this.player_.options_.inactivityTimeout === 0) {
      this.player_.options_.inactivityTimeout = 5000;
    }

    this.enable();
  }

  /**
   * Builds the DOM element.
   *
   * @return {Element}
   *         The DOM element.
   */
  createEl() {
    const el = dom.createEl('div', {
      className: 'vjs-touch-overlay',
      // Touch overlay is not tabbable.
      tabIndex: -1,
    });

    return el;
  }

  /**
   * Debounces to either handle a delayed single tap, or a double tap
   *
   * @param {Event} event
   *        The touch event
   *
   */
  handleTap(event) {
    // Don't handle taps on the play button
    if (event.target !== this.el_) {
      return;
    }

    event.preventDefault();

    if (this.firstTapCaptured) {
      this.firstTapCaptured = false;
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.handleDoubleTap(event);
    } else {
      this.firstTapCaptured = true;
      this.timeout = window.setTimeout(() => {
        this.firstTapCaptured = false;
        this.handleSingleTap(event);
      }, this.tapTimeout);
    }
  }

  /**
   * Toggles display of play toggle
   *
   * @param {Event} event
   *        The touch event
   *
   */
  handleSingleTap(event) {
    this.removeClass('skip');
    this.toggleClass('show-play-toggle');

    // At the moment, we only have one <video> tag at a time, but just loops it
    // all to somewhat future-proof it.
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
      // The Android-Chrome cast button appears when you tap directly on the
      // video. If anything exists above it, such as our mobile-ui overlay, the
      // action will be absorbed, causing the button to not appear. So, I've
      // tried to pass on the tap event by manually dispatching one, but it
      // didn't work.
      // Peeking at the Android-Chrome code, the cast button is refreshed when
      // the 'controllist' is updated. Since we don't use this attribute as we
      // are using the videojs controls, I'm "toggling" this attribute to force
      // the cast button to be refreshed.
      const attr = video.getAttribute('controlslist');
      if (!attr || attr.indexOf('dummy') === -1) {
        video.setAttribute('controlslist', 'dummy');
      } else {
        video.removeAttribute('controlslist');
      }
    }
  }

  /**
   * Seeks by configured number of seconds if left or right part of video double tapped
   *
   * @param {Event} event
   *        The touch event
   *
   */
  handleDoubleTap(event) {
    const rect = this.el_.getBoundingClientRect();
    const x = event.changedTouches[0].clientX - rect.left;

    // Check if double tap is in left or right area
    if (x < rect.width * 0.4) {
      this.player_.currentTime(Math.max(0, this.player_.currentTime() - this.seekSeconds));
      this.addClass('reverse');
    } else if (x > rect.width - rect.width * 0.4) {
      this.player_.currentTime(Math.min(this.player_.duration(), this.player_.currentTime() + this.seekSeconds));
      this.removeClass('reverse');
    } else {
      return;
    }

    // Remove play toggle if showing
    this.removeClass('show-play-toggle');

    // Remove and readd class to trigger animation
    this.removeClass('skip');
    window.requestAnimationFrame(() => {
      this.addClass('skip');
    });
  }

  /**
   * Enables touch handler
   */
  enable() {
    this.firstTapCaptured = false;
    this.on('touchend', this.handleTap);
  }

  /**
   * Disables touch handler
   */
  disable() {
    this.off('touchend', this.handleTap);
  }
}

Component.registerComponent('TouchOverlay', TouchOverlay);
export default TouchOverlay;
