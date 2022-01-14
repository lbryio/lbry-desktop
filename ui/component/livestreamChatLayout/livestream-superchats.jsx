// @flow
import 'scss/component/_livestream-chat.scss';

import { parseSticker, getStickerUrl } from 'util/comments';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';
import Tooltip from 'component/common/tooltip';
import UriIndicator from 'component/uriIndicator';

type Props = {
  superChats: Array<Comment>,
  toggleSuperChat: () => void,
};

export default function LivestreamSuperchats(props: Props) {
  const { superChats: superChatsByAmount, toggleSuperChat } = props;

  const superChatTopTen = React.useMemo(() => {
    return superChatsByAmount ? superChatsByAmount.slice(0, 10) : superChatsByAmount;
  }, [superChatsByAmount]);

  const stickerSuperChats = superChatsByAmount && superChatsByAmount.filter(({ comment }) => !!parseSticker(comment));

  const showMore = superChatTopTen && superChatsByAmount && superChatTopTen.length < superChatsByAmount.length;

  return !superChatTopTen ? null : (
    <div className="livestreamSuperchats__wrapper">
      <div className="livestreamSuperchats__inner">
        {superChatTopTen.map((superChat: Comment) => {
          const { comment, comment_id, channel_url, support_amount, is_fiat } = superChat;
          const isSticker = stickerSuperChats && stickerSuperChats.includes(superChat);
          const stickerImg = <OptimizedImage src={getStickerUrl(comment)} waitLoad loading="lazy" />;

          return (
            <Tooltip title={isSticker ? stickerImg : comment} key={comment_id}>
              <div className="livestream__superchat">
                <ChannelThumbnail uri={channel_url} xsmall />

                <div
                  className={classnames('livestreamSuperchat__info', {
                    'livestreamSuperchat__info--sticker': isSticker,
                    'livestreamSuperchat__info--notSticker': stickerSuperChats && !isSticker,
                  })}
                >
                  <div className="livestreamSuperchat__info--user">
                    <UriIndicator uri={channel_url} link />

                    <CreditAmount
                      hideTitle
                      size={10}
                      className="livestreamSuperchat__amount--large"
                      amount={support_amount}
                      isFiat={is_fiat}
                    />
                  </div>

                  {isSticker && <div className="livestreamSuperchat__info--image">{stickerImg}</div>}
                </div>
              </div>
            </Tooltip>
          );
        })}

        {showMore && (
          <Button
            title={__('Show More...')}
            label={__('Show More')}
            button="inverse"
            className="close-button"
            onClick={toggleSuperChat}
            iconRight={ICONS.MORE}
          />
        )}
      </div>
    </div>
  );
}
