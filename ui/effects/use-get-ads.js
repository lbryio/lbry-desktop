// @flow
import React from 'react';
import { VASTClient } from 'vast-client';
import analytics from 'analytics';

const PRE_ROLL_ADS_PROVIDER = 'https://tag.targeting.unrulymedia.com/rmp/216276/0/vast2?vastfw=vpaid&w=300&h=500&url=';

// Ignores any call made 1 minutes or less after the last successful ad
const ADS_CAP_LEVEL = 1 * 60 * 1000;
const vastClient = new VASTClient(0, ADS_CAP_LEVEL);

export function useGetAds(approvedVideo: boolean, adsEnabled: boolean): [?string, (?string) => void, boolean] {
  const [isFetching, setIsFetching] = React.useState(true);
  const [adUrl, setAdUrl] = React.useState();

  // Fetch ads for all approved videos, even if we won't show ads to the user
  // Unruly needs more fetches before they will start returning ads ¯\_(ツ)_/¯
  React.useEffect(() => {
    if (!approvedVideo) {
      setIsFetching(false);
      return;
    }

    analytics.adsFetchedEvent();
    const encodedHref = encodeURI(window.location.href);
    const url = `${PRE_ROLL_ADS_PROVIDER}${encodedHref}`;
    // Used for testing on local dev
    // const url = 'https://raw.githubusercontent.com/dailymotion/vast-client-js/master/test/vastfiles/sample.xml';

    vastClient
      .get(url)
      .then((res) => {
        if (res.ads.length > 0) {
          // Let this line error if res.ads is empty
          // I took this from an example response from Dailymotion
          // It will be caught below and sent to matomo to figure out if there if this needs to be something changed to deal with unrulys data
          const adUrl = res.ads[0].creatives[0].mediaFiles[0].fileURL;

          // Dummy video file
          //   const adUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

          if (adsEnabled && adUrl) {
            setAdUrl(adUrl);
          }
        }

        setIsFetching(false);
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, [approvedVideo, adsEnabled]);

  return [adUrl, setAdUrl, isFetching];
}
