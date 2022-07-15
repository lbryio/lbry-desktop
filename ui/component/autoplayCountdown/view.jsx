// @flow
import React from 'react';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import I18nMessage from 'component/i18nMessage';
import { withRouter } from 'react-router';
import debounce from 'util/debounce';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';

const DEBOUNCE_SCROLL_HANDLER_MS = 150;
const CLASSNAME_AUTOPLAY_COUNTDOWN = 'autoplay-countdown';

type Props = {
  uri?: string,
  nextRecommendedClaim: ?StreamClaim,
  nextRecommendedUri: string,
  modal: { id: string, modalProps: {} },
  skipPaid: boolean,
  skipMature: boolean,
  isMature: boolean,
  doNavigate: () => void,
  doReplay: () => void,
  doPrevious: () => void,
  onCanceled: () => void,
  doOpenModal: (id: string, props: {}) => void,
};

function AutoplayCountdown(props: Props) {
  const {
    uri,
    nextRecommendedUri,
    nextRecommendedClaim,
    modal,
    skipPaid,
    skipMature,
    isMature,
    doNavigate,
    doReplay,
    doPrevious,
    onCanceled,
    doOpenModal,
  } = props;
  const nextTitle = nextRecommendedClaim && nextRecommendedClaim.value && nextRecommendedClaim.value.title;

  /* this value is coupled with CSS timing variables on .autoplay-countdown__timer */
  const countdownTime = 5;

  const [timer, setTimer] = React.useState(countdownTime);
  const [timerCanceled, setTimerCanceled] = React.useState(false);
  const [timerPaused, setTimerPaused] = React.useState(false);
  const anyModalPresent = modal !== undefined && modal !== null;
  const isTimerPaused = timerPaused || anyModalPresent;
  const shouldSkipMature = skipMature && isMature;
  const skipCurrentVideo = skipPaid || shouldSkipMature;

  function isAnyInputFocused() {
    const activeElement = document.activeElement;
    const inputTypes = ['input', 'select', 'textarea'];
    return activeElement && inputTypes.includes(activeElement.tagName.toLowerCase());
  }

  function shouldPauseAutoplay() {
    // TODO: use ref instead querySelector
    const elm = document.querySelector(`.${CLASSNAME_AUTOPLAY_COUNTDOWN}`);
    return isAnyInputFocused() || (elm && elm.getBoundingClientRect().top < 0);
  }

  function getMsgPlayingNext() {
    if (shouldSkipMature) {
      return __('Skipping mature content in %seconds_left% seconds...', { seconds_left: timer });
    } else if (skipPaid) {
      return __('Playing next free content in %seconds_left% seconds...', { seconds_left: timer });
    } else {
      return __('Playing in %seconds_left% seconds...', { seconds_left: timer });
    }
  }

  // Update 'setTimerPaused'.
  React.useEffect(() => {
    // Ensure correct 'setTimerPaused' on initial render.
    setTimerPaused(shouldPauseAutoplay());

    const handleScroll = debounce((e) => {
      setTimerPaused(shouldPauseAutoplay());
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update countdown timer.
  React.useEffect(() => {
    let interval;
    if (!timerCanceled && nextRecommendedUri) {
      if (isTimerPaused || isAnyInputFocused()) {
        clearInterval(interval);
        setTimer(countdownTime);
      } else {
        interval = setInterval(() => {
          const newTime = timer - 1;
          if (newTime === 0) {
            if (skipCurrentVideo) setTimer(countdownTime);
            doNavigate();
          } else {
            setTimer(timer - 1);
          }
        }, 1000);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [doNavigate, isTimerPaused, nextRecommendedUri, skipCurrentVideo, timer, timerCanceled]);

  if (timerCanceled || !nextRecommendedUri) {
    return null;
  }

  return (
    <div className="file-viewer__overlay">
      <div className={CLASSNAME_AUTOPLAY_COUNTDOWN}>
        <div className="file-viewer__overlay-secondary">
          <I18nMessage tokens={{ channel: <UriIndicator link uri={nextRecommendedUri} /> }}>
            Up Next by %channel%
          </I18nMessage>
        </div>

        <div className="file-viewer__overlay-title">{nextTitle}</div>
        <div className="autoplay-countdown__timer">
          <div className={'autoplay-countdown__button autoplay-countdown__button--' + (timer % 5)}>
            <Button onClick={doNavigate} iconSize={30} title={__('Play')} className="button--icon button--play" />
          </div>
          {isTimerPaused && (
            <div className="file-viewer__overlay-secondary autoplay-countdown__counter">
              {__('Autoplay timer paused.')}{' '}
            </div>
          )}
          {!isTimerPaused && (
            <div className="file-viewer__overlay-secondary autoplay-countdown__counter">
              {getMsgPlayingNext()}{' '}
              <Button
                label={__('Cancel')}
                button="link"
                onClick={() => {
                  setTimerCanceled(true);
                  if (onCanceled) onCanceled();
                }}
              />
            </div>
          )}
          {skipCurrentVideo && doPrevious && (
            <div>
              <Button
                label={__('Play Previous')}
                button="link"
                icon={ICONS.PLAY_PREVIOUS}
                onClick={() => doPrevious()}
              />
            </div>
          )}
          <div>
            <Button
              label={shouldSkipMature ? undefined : skipPaid ? __('Purchase?') : __('Replay?')}
              button="link"
              icon={shouldSkipMature ? undefined : skipPaid ? ICONS.WALLET : ICONS.REPLAY}
              onClick={() => {
                setTimerCanceled(true);
                if (skipPaid) {
                  doOpenModal(MODALS.AFFIRM_PURCHASE, { uri, cancelCb: () => setTimerCanceled(false) });
                } else {
                  doReplay();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(AutoplayCountdown);
