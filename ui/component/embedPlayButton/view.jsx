// @flow
import * as RENDER_MODES from 'constants/file_render_modes';
import React, { useEffect } from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import { useHistory } from 'react-router-dom';
import { useIsMobile } from 'effects/use-screensize';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  uri: string,
  thumbnail: string,
  claim: ?Claim,
  doResolveUri: (string) => void,
  doFetchCostInfoForUri: (string) => void,
  costInfo: ?{ cost: number },
  floatingPlayerEnabled: boolean,
  doPlayUri: (string, ?boolean, ?boolean, (GetResponse) => void) => void,
  doAnaltyicsPurchaseEvent: (GetResponse) => void,
  parentCommentId?: string,
  isMarkdownPost: boolean,
  doSetPlayingUri: ({}) => void,
  renderMode: string,
};

export default function EmbedPlayButton(props: Props) {
  const {
    uri,
    thumbnail = '',
    claim,
    doResolveUri,
    doFetchCostInfoForUri,
    floatingPlayerEnabled,
    doPlayUri,
    doSetPlayingUri,
    doAnaltyicsPurchaseEvent,
    costInfo,
    parentCommentId,
    isMarkdownPost,
    renderMode,
  } = props;
  const {
    push,
    location: { pathname },
  } = useHistory();
  const isMobile = useIsMobile();
  const hasResolvedUri = claim !== undefined;
  const hasCostInfo = costInfo !== undefined;
  const disabled = !hasResolvedUri || !costInfo;
  const canPlayInline = [RENDER_MODES.AUDIO, RENDER_MODES.VIDEO].includes(renderMode);

  useEffect(() => {
    if (!hasResolvedUri) {
      doResolveUri(uri);
    }

    if (!hasCostInfo) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, doResolveUri, doFetchCostInfoForUri, hasCostInfo, hasResolvedUri]);

  function handleClick() {
    if (disabled) {
      return;
    }

    if (isMobile || !floatingPlayerEnabled || !canPlayInline) {
      const formattedUrl = formatLbryUrlForWeb(uri);
      push(formattedUrl);
    } else {
      doPlayUri(uri, undefined, undefined, (fileInfo) => {
        let playingOptions = { uri, pathname, source: undefined, commentId: undefined };
        if (parentCommentId) {
          playingOptions.source = 'comment';
          playingOptions.commentId = parentCommentId;
        } else if (isMarkdownPost) {
          playingOptions.source = 'markdown';
        }

        doSetPlayingUri(playingOptions);
        doAnaltyicsPurchaseEvent(fileInfo);
      });
    }
  }

  return (
    <div
      disabled={disabled}
      role="button"
      className="embed__inline-button"
      onClick={handleClick}
      style={{ backgroundImage: `url('${thumbnail.replace(/'/g, "\\'")}')` }}
    >
      <FileViewerEmbeddedTitle uri={uri} isInApp />
      <Button
        onClick={handleClick}
        iconSize={30}
        title={__('Play')}
        className={classnames('button--icon', {
          'button--play': canPlayInline,
          'button--view': !canPlayInline,
        })}
        disabled={disabled}
      />
    </div>
  );
}
