// @flow
import type { ElementRef } from 'react';
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
import Slide from '@mui/material/Slide';
import { Lbryio } from 'lbryinc';

type Props = {
  superChats: Array<Comment>,
  hyperchatsHidden?: boolean,
  isMobile?: boolean,
  toggleHyperChat: () => void,
};

export default function LivestreamHyperchats(props: Props) {
  const { superChats: hyperChatsByAmount, hyperchatsHidden, isMobile, toggleHyperChat } = props;

  const superChatTopTen = React.useMemo(() => {
    return hyperChatsByAmount ? hyperChatsByAmount.slice(0, 10) : hyperChatsByAmount;
  }, [hyperChatsByAmount]);

  const [exchangeRate, setExchangeRate] = React.useState(0);
  React.useEffect(() => {
    if (!exchangeRate) Lbryio.getExchangeRates().then(({ LBC_USD }) => setExchangeRate(LBC_USD));
  }, [exchangeRate]);

  const stickerSuperChats = hyperChatsByAmount && hyperChatsByAmount.filter(({ comment }) => !!parseSticker(comment));

  const showMore = superChatTopTen && hyperChatsByAmount && superChatTopTen.length < hyperChatsByAmount.length;
  const elRef: ElementRef<any> = React.useRef();
  const [showTooltip, setShowTooltip] = React.useState(true);

  React.useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (
          !showTooltip ||
          e.deltaY === 0 ||
          (el.scrollLeft === 0 && e.deltaY < 0) ||
          el.scrollLeft === el.scrollWidth
        ) {
          return;
        }

        if (showTooltip) {
          setShowTooltip(false);
          e.preventDefault();
          let scrollSpace =
            el.scrollLeft + e.deltaY * 2.5 < el.scrollWidth ? el.scrollLeft + e.deltaY * 2.5 : el.scrollWidth;
          el.scrollTo({
            left: scrollSpace,
            behavior: 'smooth',
          });
          setTimeout(() => {
            setShowTooltip(true);
          }, 1000);
        }
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return !superChatTopTen ? null : (
    <Slider isMobile={isMobile} hyperchatsHidden={hyperchatsHidden}>
      <div
        ref={elRef}
        className={classnames('livestream-hyperchats__wrapper', {
          'livestream-hyperchats__wrapper--mobile': isMobile,
        })}
      >
        <div className="livestream-hyperchats">
          {superChatTopTen.map((hyperChat: Comment) => {
            const { comment, comment_id, channel_url, support_amount, is_fiat } = hyperChat;
            const isSticker = stickerSuperChats && stickerSuperChats.includes(hyperChat);
            const stickerImg = <OptimizedImage src={getStickerUrl(comment)} waitLoad loading="lazy" />;
            const basedAmount = is_fiat && exchangeRate ? support_amount : support_amount * 10 * exchangeRate;

            return showTooltip ? (
              <Tooltip disabled title={isSticker ? stickerImg : comment}>
                <div
                  key={comment_id}
                  className={classnames('livestream-hyperchat', {
                    'livestream-hyperchat--mobile': isMobile,
                    'hyperchat-preview-level1': basedAmount >= 5,
                    'hyperchat-preview-level2': basedAmount >= 10,
                    'hyperchat-preview-level3': basedAmount >= 50,
                    'hyperchat-preview-level4': basedAmount >= 100,
                    'hyperchat-preview-level5': basedAmount >= 500,
                  })}
                >
                  <ChannelThumbnail uri={channel_url} xsmall showMemberBadge />

                  <div
                    className={classnames('livestreamHyperchat__info', {
                      'livestreamHyperchat__info--sticker': isSticker,
                      'livestreamHyperchat__info--notSticker': stickerSuperChats && !isSticker,
                    })}
                  >
                    <div className="livestreamHyperchat__info--user">
                      <UriIndicator uri={channel_url} link showAtSign />

                      <CreditAmount
                        hideTitle
                        size={10}
                        className="livestreamHyperchat__amount--large"
                        amount={support_amount}
                        isFiat={is_fiat}
                      />
                    </div>

                    {isSticker && <div className="livestreamHyperchat__info--image">{stickerImg}</div>}
                  </div>
                </div>
              </Tooltip>
            ) : (
              <div
                className={classnames('livestream-hyperchat', {
                  'livestream-hyperchat--mobile': isMobile,
                })}
              >
                <ChannelThumbnail uri={channel_url} xsmall />

                <div
                  className={classnames('livestreamHyperchat__info', {
                    'livestreamHyperchat__info--sticker': isSticker,
                    'livestreamHyperchat__info--notSticker': stickerSuperChats && !isSticker,
                  })}
                >
                  <div className="livestreamHyperchat__info--user">
                    <UriIndicator uri={channel_url} link showAtSign />

                    <CreditAmount
                      hideTitle
                      size={10}
                      className="livestreamHyperchat__amount--large"
                      amount={support_amount}
                      isFiat={is_fiat}
                    />
                  </div>

                  {isSticker && <div className="livestreamHyperchat__info--image">{stickerImg}</div>}
                </div>
              </div>
            );
          })}

          {showMore && (
            <Button
              title={__('Show More...')}
              label={__('Show More')}
              button="inverse"
              className="close-button"
              onClick={() => toggleHyperChat()}
              iconRight={ICONS.MORE}
            />
          )}
        </div>
      </div>
    </Slider>
  );
}

type SliderProps = {
  hyperchatsHidden?: boolean,
  children: any,
};

const Slider = (sliderProps: SliderProps) => {
  const { hyperchatsHidden, children } = sliderProps;

  return (
    <Slide direction="left" in={!hyperchatsHidden} mountOnEnter unmountOnExit>
      {children}
    </Slide>
  );
};
