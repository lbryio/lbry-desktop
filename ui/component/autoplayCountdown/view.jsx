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
};

function AutoplayCountdown(props: Props) {
  const {
    nextRecommendedUri,
    nextRecommendedClaim,
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
          push(navigateUrl);
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, navigateUrl, push, timerCanceled]);

  if (timerCanceled) {
    return null;
  }

  return (
    <div className="video-overlay__wrapper">
      <div className="video-overlay__subtitle">Up Next</div>
      <div className="video-overlay__title">{nextTitle}</div>
      <UriIndicator link uri={nextRecommendedUri} />

      <div className="video-overlay__actions">
        <div className="video-overlay__subtitle">Playing in {timer} seconds</div>
        <div className="section__actions--centered">
          <Button label={__('Cancel')} button="secondary" onClick={() => setTimerCanceled(true)} />
        </div>
      </div>
    </div>
  );
}

export default withRouter(AutoplayCountdown);
