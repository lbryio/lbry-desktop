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
  setPlayingUri: (string | null) => void,
};

function AutoplayCountdown(props: Props) {
  const {
    nextRecommendedUri,
    nextRecommendedClaim,
    setPlayingUri,
    isFloating,
    history: { push },
  } = props;
  const nextTitle = nextRecommendedClaim && nextRecommendedClaim.value && nextRecommendedClaim.value.title;

  /* this value is coupled with CSS timing variables on .autoplay-countdown__timer */
  const countdownTime = 5;

  const [timer, setTimer] = React.useState(countdownTime);
  const [timerCanceled, setTimerCanceled] = React.useState(false);

  let navigateUrl;
  if (nextTitle) {
    navigateUrl = formatLbryUrlForWeb(nextRecommendedUri);
  }

  const doNavigate = useCallback(() => {
    if (!isFloating) {
      if (navigateUrl) {
        push(navigateUrl);
        setPlayingUri(null);
      }
    } else {
      if (nextRecommendedUri) {
        setPlayingUri(nextRecommendedUri);
      }
    }
  }, [navigateUrl, nextRecommendedUri, isFloating, setPlayingUri]);

  React.useEffect(() => {
    let interval;
    if (!timerCanceled && nextRecommendedUri) {
      interval = setInterval(() => {
        const newTime = timer - 1;
        if (newTime === 0) {
          doNavigate();
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, doNavigate, navigateUrl, push, timerCanceled, setPlayingUri, nextRecommendedUri]);

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
          <div className="file-viewer__overlay-secondary autoplay-countdown__counter">
            {__('Playing in %seconds_left% seconds...', { seconds_left: timer })}{' '}
            <Button label={__('Cancel')} button="link" onClick={() => setTimerCanceled(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(AutoplayCountdown);
