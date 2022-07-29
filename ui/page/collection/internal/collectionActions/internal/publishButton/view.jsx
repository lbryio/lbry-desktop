// @flow
import * as ICONS from 'constants/icons';
import { useHistory } from 'react-router';
import { PUBLISH_PAGE, PAGE_VIEW_QUERY } from 'page/collection/view';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  // redux
  collectionHasEdits: boolean,
  claimIsPending: boolean,
  collectionLength: number,
};

function CollectionPublishButton(props: Props) {
  const { collectionHasEdits, claimIsPending, collectionLength } = props;

  const { push } = useHistory();

  if (collectionLength === 0) return null;

  return (
    <FileActionButton
      title={collectionHasEdits ? __('Publish Updates') : __('Publish')}
      label={collectionHasEdits ? __('Publish Updates') : __('Publish')}
      onClick={() => push(`?${PAGE_VIEW_QUERY}=${PUBLISH_PAGE}`)}
      icon={ICONS.PUBLISH}
      iconColor={collectionHasEdits ? 'red' : undefined}
      iconSize={18}
      disabled={claimIsPending}
    />
  );
}

export default CollectionPublishButton;
