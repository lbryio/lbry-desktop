// @flow
import React, { useCallback } from 'react';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import I18nMessage from 'component/i18nMessage';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import debounce from 'util/debounce';
import { COLLECTIONS_CONSTS } from 'lbry-redux';
const DEBOUNCE_SCROLL_HANDLER_MS = 150;
const CLASSNAME_AUTOPLAY_COUNTDOWN = 'autoplay-countdown';

type Props = {
  history: { push: (string) => void },
  nextRecommendedClaim: ?StreamClaim,
  nextRecommendedUri: string,
  isFloating: boolean,
  doSetPlayingUri: ({ uri: ?string }) => void,
  doPlayUri: (string) => void,
  modal: { id: string, modalProps: {} },
  collectionId?: string,
};

function AutoplayCountdown(props: Props) {
  const {
    nextRecommendedUri,
    nextRecommendedClaim,
    doSetPlayingUri,
    doPlayUri,
    isFloating,
    history: { push },
    modal,
    collectionId,
  } = props;
  const nextTitle = nextRecommendedClaim && nextRecommendedClaim.value && nextRecommendedClaim.value.title;

  /* this value is coupled with CSS timing variables on .autoplay-countdown__timer */
  const countdownTime = 5;

  const [timer, setTimer] = React.useState(countdownTime);
  const [timerCanceled, setTimerCanceled] = React.useState(false);
  const [timerPaused, setTimerPaused] = React.useState(false);
  const anyModalPresent = modal !== undefined && modal !== null;
  const isTimerPaused = timerPaused || anyModalPresent;

  let navigateUrl;
  if (nextTitle) {
    navigateUrl = formatLbryUrlForWeb(nextRecommendedUri);
    if (collectionId) {
      const collectionParams = new URLSearchParams();
      collectionParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);
      navigateUrl = navigateUrl + `?` + collectionParams.toString();
    }
  }

  const doNavigate = useCallback(() => {
    if (!isFloating) {
      if (navigateUrl) {
        push(navigateUrl);
        doSetPlayingUri({ uri: nextRecommendedUri });
        doPlayUri(nextRecommendedUri);
      }
    } else {
      if (nextRecommendedUri) {
        doSetPlayingUri({ uri: nextRecommendedUri });
        doPlayUri(nextRecommendedUri);
      }
    }
  }, [navigateUrl, nextRecommendedUri, isFloating, doSetPlayingUri, doPlayUri, push]);

  function shouldPauseAutoplay() {
    const elm = document.querySelector(`.${CLASSNAME_AUTOPLAY_COUNTDOWN}`);
    return elm && elm.getBoundingClientRect().top < 0;
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
      if (isTimerPaused) {
        clearInterval(interval);
        setTimer(countdownTime);
      } else {
        interval = setInterval(() => {
          const newTime = timer - 1;
          if (newTime === 0) {
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
  }, [timer, doNavigate, navigateUrl, push, timerCanceled, isTimerPaused, nextRecommendedUri]);

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
              {__('Playing in %seconds_left% seconds...', { seconds_left: timer })}{' '}
              <Button label={__('Cancel')} button="link" onClick={() => setTimerCanceled(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(AutoplayCountdown);
