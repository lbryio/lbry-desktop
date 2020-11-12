// @flow
import React from 'react';
import classnames from 'classnames';
import ChannelThumbnail from 'component/channelThumbnail';
import Button from 'component/button';
import { parseURI } from 'lbry-redux';
import * as ICONS from '../../constants/icons';
import * as MODALS from 'constants/modal_types';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  uri: string,
  doChannelUnsubscribe: SubscriptionArgs => void,
  type: string,
  blockedChannelUris: Array<string>,
  doOpenModal: (string, {}) => void,
};

function AbandonedChannelPreview(props: Props) {
  const { uri, doChannelUnsubscribe, type, blockedChannelUris, doOpenModal } = props;
  const { channelName } = parseURI(uri);
  const isBlockedChannel = blockedChannelUris.includes(uri);

  return (
    <li className={classnames('claim-preview__wrapper', 'claim-preview__wrapper--notice')}>
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <ChannelThumbnail uri={uri} />
        <div className="claim-preview__text">
          <div className="claim-preview-metadata">
            <div className="claim-preview-info">
              <div className="claim-preview__title">{channelName}</div>
            </div>
            <div className="media__subtitle">{__(`This channel may have been unpublished.`)}</div>
          </div>
          <div className="claim-preview__actions">
            {isBlockedChannel && (
              <Button
                iconColor="red"
                icon={ICONS.UNBLOCK}
                button={'alt'}
                label={__('Unblock')}
                onClick={() => doOpenModal(MODALS.REMOVE_BLOCKED, { blockedUri: uri })}
              />
            )}
            {/* SubscribeButton uses resolved permanentUri; modifying it didn't seem worth it. */}
            {!isBlockedChannel && (
              <Button
                iconColor="red"
                icon={ICONS.UNSUBSCRIBE}
                button={'alt'}
                label={__('Unfollow')}
                onClick={e => {
                  e.stopPropagation();
                  doChannelUnsubscribe({
                    channelName: `@${channelName}`,
                    uri,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default AbandonedChannelPreview;
