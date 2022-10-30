// @flow
import React from 'react';
import classnames from 'classnames';
import ChannelThumbnail from 'component/channelThumbnail';
import Icon from 'component/common/icon';
import { getClaimTitle } from 'util/claim';

type Props = {
  uri: string,
  claim: ?Claim, // Get from parent, so we don't need to call the selector for each entry.
  resolvingUris: Array<string>,
  onClick?: (MouseEvent) => void,
  noHoverHighlight?: boolean,
  iconRight?: string,
  iconRightOnHoverOnly?: boolean,
  hideInvalid?: boolean,
};

export default function Entry(props: Props) {
  const { uri, claim, resolvingUris, onClick, noHoverHighlight, iconRight, iconRightOnHoverOnly, hideInvalid } = props;

  const title = getClaimTitle(claim);
  const name = claim?.name || '';
  const tooltip = [title || '', name, uri].join('\n');
  const isResolvingUri = resolvingUris.includes(uri);
  const isInvalid = claim === null;

  return (
    <div
      className={classnames('entry', {
        'entry--no-hover-highlight': noHoverHighlight,
        'entry--hidden': isInvalid && hideInvalid,
        'non-clickable': !uri,
      })}
      title={tooltip}
      onClick={onClick}
    >
      <div className="entry__content">
        {claim ? (
          <>
            <ChannelThumbnail xsmall uri={uri} />
            <div className="entry__label">
              <span className="entry__title">{title || name}</span>
              <span className="entry__name">{name}</span>
            </div>
          </>
        ) : (
          <>
            <ChannelThumbnail xsmall />
            <div className="entry__label">
              {uri === null ? (
                <span className="entry__title">{'---'}</span>
              ) : isResolvingUri || claim === undefined ? (
                <>
                  <span className="entry__title entry__title--placeholder" />
                  <span className="entry__name entry__name--placeholder" />
                </>
              ) : (
                <>
                  <span className="entry__title">{'[Removed]'}</span>
                  <span className="entry__name">{uri}</span>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <div
        className={classnames('entry__action-icon', {
          'entry__action-icon--hover-only': iconRightOnHoverOnly,
        })}
      >
        {iconRight && <Icon icon={iconRight} />}
      </div>
    </div>
  );
}
