// @flow
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import FileRender from 'component/fileRender';
import usePrevious from 'effects/use-previous';

type Props = {
  mediaType: string,
  contentType: string,
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  isStreamable: boolean,
  streamingUrl?: string,
  triggerAnalyticsView: (string, number) => Promise<any>,
  claimRewards: () => void,
};

export default function TextViewer(props: Props) {
  const {
    isPlaying,
    fileInfo,
    uri,
    streamingUrl,
    isStreamable,
    triggerAnalyticsView,
    claimRewards,
    mediaType,
    contentType,
  } = props;
  const [playTime, setPlayTime] = useState();
  const webStreamOnly = contentType === 'application/pdf' || mediaType === 'text';
  const previousUri = usePrevious(uri);
  const isNewView = uri && previousUri !== uri && isPlaying;
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const isReadyToPlay = (IS_WEB && (isStreamable || streamingUrl || webStreamOnly)) || (fileInfo && fileInfo.completed);

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

  return (
    <div className={classnames('content__viewersss')}>
      {isReadyToPlay ? <FileRender uri={uri} /> : <div className="placeholder--text-document" />}
    </div>
  );
}
