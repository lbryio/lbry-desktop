// @flow
import 'scss/component/_sticker-selector.scss';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';

const buildStickerSideLink = (section: string, icon: string) => ({ section, icon });

const STICKER_SIDE_LINKS = [
  buildStickerSideLink(__('Free'), ICONS.TAG),
  buildStickerSideLink(__('Tips'), ICONS.FINANCE),
  // Future work may include Channel, Subscriptions, ...
];

type Props = { claimIsMine: boolean, onSelect: (any) => void };

export default function StickerSelector(props: Props) {
  const { claimIsMine, onSelect } = props;

  function scrollToStickerSection(section: string) {
    const listBodyEl = document.querySelector('.stickerSelector__listBody');
    const sectionToScroll = document.getElementById(section);

    if (listBodyEl && sectionToScroll) {
      // $FlowFixMe
      listBodyEl.scrollTo({
        top: sectionToScroll.offsetTop - sectionToScroll.getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });
    }
  }

  const StickerWrapper = (stickerProps: any) => {
    const { price, children } = stickerProps;

    return price ? <div className="stickerItem--paid">{children}</div> : children;
  };

  const getListRow = (rowTitle: string, rowStickers: any) => (
    <div className="stickerSelector__listBody-row">
      <div id={rowTitle} className="stickerSelector__listBody-rowTitle">
        {rowTitle}
      </div>
      <div className="stickerSelector__listBody-rowItems">
        {rowStickers.map((sticker) => (
          <Button
            key={sticker.name}
            title={sticker.name}
            button="alt"
            className="button--file-action"
            onClick={() => onSelect(sticker)}
          >
            <StickerWrapper price={sticker.price}>
              <OptimizedImage src={sticker.url} waitLoad loading="lazy" />
              {sticker.price && sticker.price > 0 && (
                <CreditAmount superChatLight amount={sticker.price} size={2} isFiat />
              )}
            </StickerWrapper>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="stickerSelector">
      <div className="stickerSelector__header card__header--between">
        <div className="stickerSelector__headerTitle card__title-section--small">{__('Stickers')}</div>
      </div>

      <div className="stickerSelector__list">
        <div className="stickerSelector__listBody">
          {getListRow(__('Free'), FREE_GLOBAL_STICKERS)}
          {!claimIsMine && getListRow(__('Tips'), PAID_GLOBAL_STICKERS)}
        </div>

        <div className="navigation__wrapper">
          <ul className="navigation-links">
            {STICKER_SIDE_LINKS.map(
              (linkProps) =>
                ((claimIsMine && linkProps.section !== 'Tips') || !claimIsMine) && (
                  <li key={linkProps.section}>
                    <Button
                      label={__(linkProps.section)}
                      title={__(linkProps.section)}
                      icon={linkProps.icon}
                      iconSize={1}
                      className="navigation-link"
                      onClick={() => scrollToStickerSection(linkProps.section)}
                    />
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
