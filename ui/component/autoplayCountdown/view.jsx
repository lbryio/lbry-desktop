// @flow
import React, { useCallback } from 'react';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import I18nMessage from 'component/i18nMessage';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';

type Props = {
  history: { push: string => void },
  nextRecommendedClaim: ?StreamClaim,
  nextRecommendedUri: string,
  isFloating: boolean,
  doSetPlayingUri: (string | null) => void,
  doPlayUri: string => void,
};

function AutoplayCountdown(props: Props) {
  const {
    nextRecommendedUri,
    nextRecommendedClaim,
    doSetPlayingUri,
    doPlayUri,
    isFloating,
    history: { push },
  } = props;
  const nextTitle = nextRecommendedClaim && nextRecommendedClaim.value && nextRecommendedClaim.value.title;

  /* this value is coupled with CSS timing variables on .autoplay-countdown__timer */
  const countdownTime = 5;

  const [timer, setTimer] = React.useState(countdownTime);
  const [timerCanceled, setTimerCanceled] = React.useState(false);
  const [timerPaused, setTimerPaused] = React.useState(false);

  let navigateUrl;
  if (nextTitle) {
    navigateUrl = formatLbryUrlForWeb(nextRecommendedUri);
  }

  const doNavigate = useCallback(() => {
    if (!isFloating) {
      if (navigateUrl) {
        push(navigateUrl);
        doSetPlayingUri(nextRecommendedUri);
        doPlayUri(nextRecommendedUri);
      }
    } else {
      if (nextRecommendedUri) {
        doSetPlayingUri(nextRecommendedUri);
        doPlayUri(nextRecommendedUri);
      }
    }
  }, [navigateUrl, nextRecommendedUri, isFloating, doSetPlayingUri, doPlayUri]);

  function debounce(fn, time) {
    let timeoutId;
    return wrapper;
    function wrapper(...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fn(...args);
      }, time);
    }
  }

  React.useEffect(() => {
    const handleScroll = debounce(e => {
      const elm = document.querySelector('.autoplay-countdown');
      if (elm) {
        setTimerPaused(elm.getBoundingClientRect().top < 0);
      }
    }, 150);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    let interval;
    if (!timerCanceled && nextRecommendedUri) {
      if (timerPaused) {
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
  }, [timer, doNavigate, navigateUrl, push, timerCanceled, timerPaused, nextRecommendedUri]);

  if (timerCanceled || !nextRecommendedUri) {
    return null;
  }

  return (
    <div className="file-viewer__overlay">
      <div className="autoplay-countdown">
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
          {timerPaused && (
            <div className="file-viewer__overlay-secondary autoplay-countdown__counter">
              {__('Autoplay timer paused.')}{' '}
            </div>
          )}
          {!timerPaused && (
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
