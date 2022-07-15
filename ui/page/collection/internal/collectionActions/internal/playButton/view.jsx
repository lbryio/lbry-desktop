// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import FileActionButton from 'component/common/file-action-button';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';

type ButtonProps = {
  uri: string,
  collectionId: string,
};

const PlayButton = (props: ButtonProps) => {
  const { uri, collectionId } = props;

  const { push } = useHistory();

  function handlePlay() {
    push({
      pathname: formatLbryUrlForWeb(uri),
      search: generateListSearchUrlParams(collectionId),
      state: { forceAutoplay: true },
    });
  }

  return <FileActionButton icon={ICONS.PLAY} title={__('Start Playing')} label={__('Play')} onClick={handlePlay} />;
};

export default PlayButton;
