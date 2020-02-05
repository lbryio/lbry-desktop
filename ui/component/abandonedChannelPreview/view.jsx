// @flow
import React from 'react';
import classnames from 'classnames';
import ChannelThumbnail from 'component/channelThumbnail';
import Button from 'component/button';
import { parseURI } from 'lbry-redux';
import * as ICONS from '../../constants/icons';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  uri: string,
  doChannelUnsubscribe: SubscriptionArgs => void,
  type: string,
};

function AbandonedChannelPreview(props: Props) {
  const { uri, doChannelUnsubscribe, type } = props;
  const { channelName } = parseURI(uri);

  return (
    <li
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <ChannelThumbnail uri={uri} />
        <div className="claim-preview__text">
          <div className="claim-preview-metadata">
            <div className="claim-preview-info">
              <div className="claim-preview__title">{channelName}</div>
            </div>
            <div className="media__subtitle">{`This channel may have been abandoned.`}</div>
          </div>
          <div className="claim-preview__actions">
            <Button
              // ref={buttonRef}
              iconColor="red"
              icon={ICONS.UNSUBSCRIBE}
              button={'alt'}
              label={__('Unfollow')}
              onClick={e => {
                e.stopPropagation();
                doChannelUnsubscribe({
                  channelName,
                  uri,
                });
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

export default AbandonedChannelPreview;
