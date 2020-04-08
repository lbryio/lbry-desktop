// @flow
import React, { useState, useEffect } from 'react';
import FileRender from 'component/fileRender';
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
  const isReadyToPlay = streamingUrl || (fileInfo && fileInfo.completed);

  useEffect(() => {
    if (isPlaying) {
      setPlayTime(Date.now());
    }
  }, [isPlaying, setPlayTime, uri]);

  useEffect(() => {
    if (playTime && isReadyToPlay) {
      const timeToStart = Date.now() - playTime;

      triggerAnalyticsView(uri, timeToStart).then(() => {
        claimRewards();
        setPlayTime(null);
      });
    }
  }, [setPlayTime, claimRewards, triggerAnalyticsView, isReadyToPlay, playTime, uri]);

  if (!isPlaying) {
    return null;
  }

  return isReadyToPlay ? <FileRender uri={uri} /> : <LoadingScreen status={__('Preparing your content')} />;
}
