// @flow
import React, { useState, useEffect } from 'react';
import FileRender from 'component/fileRender';
import usePrevious from 'effects/use-previous';
import LoadingScreen from 'component/common/loading-screen';

type Props = {
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  renderMode: string,
  streamingUrl?: string,
  triggerAnalyticsView: (string, number) => Promise<any>,
  claimRewards: () => void,
};

export default function FileRenderInline(props: Props) {
  const { isPlaying, fileInfo, uri, streamingUrl, triggerAnalyticsView, claimRewards } = props;

  const [playTime, setPlayTime] = useState();
  const previousUri = usePrevious(uri);
  const isNewView = uri && previousUri !== uri && isPlaying;
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const isReadyToPlay = streamingUrl || (fileInfo && fileInfo.completed);

  useEffect(() => {
    if (isNewView) {
      setPlayTime(Date.now());
    }
  }, [isNewView, uri]);

  useEffect(() => {
    if (playTime && isReadyToPlay && !hasRecordedView) {
      const timeToStart = Date.now() - playTime;
      triggerAnalyticsView(uri, timeToStart).then(() => {
        claimRewards();
        setHasRecordedView(false);
        setPlayTime(null);
      });
    }
  }, [setPlayTime, triggerAnalyticsView, isReadyToPlay, hasRecordedView, playTime, uri, claimRewards]);

  if (!isPlaying) {
    return null;
  }

  return isReadyToPlay ? <FileRender uri={uri} /> : <LoadingScreen status={__('Preparing your content')} />;
}
