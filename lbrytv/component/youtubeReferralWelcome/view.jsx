// @flow
import * as MODALS from 'constants/modal_types';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';

type Props = { doOpenModal: string => void, user: ?User };

const YoutubeWelcome = (props: Props) => {
  const { doOpenModal, user } = props;
  const [hasBeenShownIntro, setHasBeenShownIntro] = usePersistedState('youtube-welcome', false);
  const isYouTubeReferrer = document.referrer.includes('youtube.com');
  const shouldShowWelcome = !hasBeenShownIntro && isYouTubeReferrer && user && !user.has_verified_email;

  React.useEffect(() => {
    if (shouldShowWelcome) {
      doOpenModal(MODALS.YOUTUBE_WELCOME);
      setHasBeenShownIntro(true);
    }
  }, [shouldShowWelcome, setHasBeenShownIntro, doOpenModal]);

  return null;
};

export default YoutubeWelcome;
