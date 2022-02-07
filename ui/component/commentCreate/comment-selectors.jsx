// @flow
import 'scss/component/_comment-selectors.scss';

import { EMOTES_48px as EMOTES } from 'constants/emotes';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';

export const SELECTOR_TABS = {
  EMOJI: 0,
  STICKER: 1,
};

type Props = {
  claimIsMine?: boolean,
  openTab?: number,
  addEmoteToComment: (string) => void,
  handleSelectSticker: (any) => void,
  closeSelector?: () => void,
};

export default function CommentSelectors(props: Props) {
  const { claimIsMine, openTab, addEmoteToComment, handleSelectSticker, closeSelector } = props;

  const tabProps = { closeSelector };

  return (
    <Tabs index={openTab}>
      <TabList className="tabs__list--comment-selector">
        <Tab>{__('Emojis')}</Tab>
        <Tab>{__('Stickers')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <EmojisPanel handleSelect={(emote) => addEmoteToComment(emote)} {...tabProps} />
        </TabPanel>

        <TabPanel>
          <StickersPanel
            handleSelect={(sticker) => handleSelectSticker(sticker)}
            claimIsMine={claimIsMine}
            {...tabProps}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

type EmojisProps = {
  handleSelect: (emoteName: string) => void,
  closeSelector: () => void,
};

const EmojisPanel = (emojisProps: EmojisProps) => {
  const { handleSelect, closeSelector } = emojisProps;

  return (
    <div className="selector-menu">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />

      <div className="emote-selector__items">
        {EMOTES.map((emote) => {
          const { name, url } = emote;

          return (
            <Button
              key={name}
              title={name}
              button="alt"
              className="button--file-action"
              onClick={() => handleSelect(name)}
            >
              <img src={url} loading="lazy" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

type StickersProps = {
  claimIsMine: any,
  handleSelect: (any) => void,
  closeSelector: () => void,
};

const StickersPanel = (stickersProps: StickersProps) => {
  const { claimIsMine, handleSelect, closeSelector } = stickersProps;

  const defaultRowProps = { handleSelect };

  return (
    <div className="selector-menu--stickers">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />

      <StickersRow title={__('Free')} stickers={FREE_GLOBAL_STICKERS} {...defaultRowProps} />
      {!claimIsMine && <StickersRow title={__('Tips')} stickers={PAID_GLOBAL_STICKERS} {...defaultRowProps} />}
    </div>
  );
};

type RowProps = {
  title: string,
  stickers: any,
  handleSelect: (string) => void,
};

const StickersRow = (rowProps: RowProps) => {
  const { title, stickers, handleSelect } = rowProps;

  return (
    <div className="sticker-selector__body-row">
      <label id={title} className="sticker-selector__row-title">
        {title}
      </label>

      <div className="sticker-selector__items">
        {stickers.map((sticker) => {
          const { price, url, name } = sticker;

          return (
            <Button
              key={name}
              title={name}
              button="alt"
              className="button--file-action"
              onClick={() => handleSelect(sticker)}
            >
              <StickerWrapper price={price}>
                <img src={url} loading="lazy" />
                {price && price > 0 && <CreditAmount superChatLight amount={price} size={2} isFiat />}
              </StickerWrapper>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

type StickerProps = {
  price?: number,
  children: any,
};

const StickerWrapper = (stickerProps: StickerProps) => {
  const { price, children } = stickerProps;

  return price ? <div className="sticker-item--priced">{children}</div> : children;
};
