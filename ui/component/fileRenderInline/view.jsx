// @flow
import React, { useState, useEffect } from 'react';
import FileRender from 'component/fileRender';
import LoadingScreen from 'component/common/loading-screen';
import { NON_STREAM_MODES } from 'constants/file_render_modes';

type Props = {
  isPlaying: boolean,
  fileInfo: FileListItem,
  uri: string,
  renderMode: string,
  streamingUrl?: string,
  triggerAnalyticsView: (string, number) => Promise<any>,
  claimRewards: () => void,
  claimIsMine: boolean,
  costInfo: any,
  sdkPaid: boolean,
  contentRestrictedFromUser: boolean,
  isFiatRequired: boolean,
  isFiatPaid: ?boolean,
};

export default function FileRenderInline(props: Props) {
  const {
    claimRewards,
    sdkPaid,
    claimIsMine,
    costInfo,
    fileInfo,
    isPlaying,
    renderMode,
    streamingUrl,
    triggerAnalyticsView,
    uri,
    contentRestrictedFromUser,
    isFiatRequired,
    isFiatPaid,
  } = props;

  const [playTime, setPlayTime] = useState();

  const isSdkFree = !costInfo || (costInfo.cost !== undefined && costInfo.cost === 0);
  const isPaymentCleared = claimIsMine || ((isSdkFree || sdkPaid) && (!isFiatRequired || isFiatPaid));

  const isReadyToView = fileInfo && fileInfo.completed;
  const isReadyToPlay = streamingUrl || isReadyToView;

  // Render if any source is ready
  let renderContent = isReadyToPlay;

  // Force non-streaming content to wait for download
  if (NON_STREAM_MODES.includes(renderMode)) {
    renderContent = isReadyToView;
  }

  useEffect(() => {
    if (isPlaying) {
      setPlayTime(Date.now());
    }
  }, [isPlaying, setPlayTime, uri]);

  useEffect(() => {
    /*
    note: code can currently double fire with videoViewer logic if a video is rendered by FileRenderInline (currently this never happens)
     */
    if (playTime && isReadyToPlay) {
      const timeToStart = Date.now() - playTime;

      triggerAnalyticsView(uri, timeToStart).then(() => {
        claimRewards();
        setPlayTime(null);
      });
    }
  }, [setPlayTime, claimRewards, triggerAnalyticsView, isReadyToPlay, playTime, uri]);

  if (!isPlaying || !isPaymentCleared || contentRestrictedFromUser) {
    return null;
  }

  return renderContent ? <FileRender uri={uri} /> : <LoadingScreen isDocument />;
}
