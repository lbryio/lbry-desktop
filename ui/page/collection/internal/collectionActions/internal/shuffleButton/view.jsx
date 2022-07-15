// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import FileActionButton from 'component/common/file-action-button';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';

type ButtonProps = {
  collectionId: string,
  // redux
  uri: string,
  doToggleShuffleList: (params: { currentUri?: string, collectionId: string, hideToast?: boolean }) => void,
};

const ShuffleButton = (props: ButtonProps) => {
  const { collectionId, uri, doToggleShuffleList } = props;

  const { push } = useHistory();

  const [doShuffle, setDoShuffle] = React.useState(false);

  function handleEnableShuffle(shouldShuffle: boolean) {
    setDoShuffle(true);
    doToggleShuffleList({ collectionId, hideToast: true });
  }

  const doPlay = React.useCallback(
    (playUri) => {
      push({
        pathname: formatLbryUrlForWeb(playUri),
        search: generateListSearchUrlParams(collectionId),
        state: { forceAutoplay: true },
      });
    },
    [collectionId, push]
  );

  React.useEffect(() => {
    if (uri && doShuffle) {
      setDoShuffle(false);
      doPlay(uri);
    }
  }, [doPlay, doShuffle, uri]);

  return (
    <FileActionButton
      icon={ICONS.SHUFFLE}
      title={__('Play in Shuffle mode')}
      label={__('Shuffle')}
      onClick={handleEnableShuffle}
    />
  );
};

export default ShuffleButton;
