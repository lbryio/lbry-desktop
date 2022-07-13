// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

type Props = {
  count: number,
  hasEdits: boolean,
};

function CollectionItemCount(props: Props) {
  const { count = 0, hasEdits } = props;

  return (
    <div className="claim-preview__claim-property-overlay">
      <div className="claim-preview__overlay-properties--small">
        <Icon icon={ICONS.PLAYLIST} />
        {hasEdits && <Icon customTooltipText={__('Unpublished Edits')} tooltip iconColor="red" icon={ICONS.PUBLISH} />}
        <span>{count}</span>
      </div>
    </div>
  );
}

export default CollectionItemCount;
