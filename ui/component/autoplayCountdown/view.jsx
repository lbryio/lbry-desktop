// @flow
import React from 'react';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';

type Props = {
  history: { push: string => void },
  nextRecommendedClaim: ?StreamClaim,
  nextRecommendedUri: string,
  setPlayingUri: (string | null) => void,
};

function AutoplayCountdown(props: Props) {
  const {
    nextRecommendedUri,
    nextRecommendedClaim,
    setPlayingUri,
    history: { push },
  } = props;
  const nextTitle = nextRecommendedClaim && nextRecommendedClaim.value && nextRecommendedClaim.value.title;
  const [timer, setTimer] = React.useState(5);
  const [timerCanceled, setTimerCanceled] = React.useState(false);

  let navigateUrl;
  if (nextTitle) {
    navigateUrl = formatLbryUrlForWeb(nextRecommendedUri);
  }

  React.useEffect(() => {
    let interval;
    if (!timerCanceled) {
      interval = setInterval(() => {
        const newTime = timer - 1;
        if (newTime === 0) {
          // Set the playingUri to null so the app doesn't try to make a floating window with the video that just finished
          setPlayingUri(null);
          push(navigateUrl);
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, navigateUrl, push, timerCanceled, setPlayingUri, nextRecommendedUri]);

  if (timerCanceled) {
    return null;
  }

  return (
    <div className="video-overlay__wrapper">
      <div className="video-overlay__subtitle">{__('Up Next')}</div>
      <div className="video-overlay__title">{nextTitle}</div>
      <UriIndicator link uri={nextRecommendedUri} />

      <div className="video-overlay__actions">
        <div className="video-overlay__subtitle">
          {__('Playing in %seconds_left% seconds', { seconds_left: timer })}
        </div>
        <div className="section__actions--centered">
          <Button label={__('Cancel')} button="secondary" onClick={() => setTimerCanceled(true)} />
        </div>
      </div>
    </div>
  );
}

export default withRouter(AutoplayCountdown);
