// @flow
import { EMOTES_48px as ODYSEE_EMOTES } from 'constants/emotes';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';
import './style.scss';

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
  const defaultRowProps = { handleSelect };

  return (
    <div className="selector-menu">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />
      {false && (
        <>
          <div className="emote-categories">
            <Icon icon={ICONS.TIME} />
            <img
              src="https://thumbnails.odycdn.com/optimize/s:200:0/quality:95/plain/https://thumbnails.lbry.com/UCMvVQIAfsGwzrfPLxiaIG8g"
              style={{ borderRadius: '50%' }}
            />
            <img src="https://static.odycdn.com/emoticons/48%20px/smile%402x.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/twitter/141/grinning-face_1f600.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/bear_1f43b.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/basketball_1f3c0.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/sparkling-heart_1f496.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/322/pirate-flag_1f3f4-200d-2620-fe0f.png" />
          </div>

          <EmoteCategory title={__('Recently used')} {...defaultRowProps} />
          <EmoteCategory title={__('Member exclusive')} {...defaultRowProps} />
        </>
      )}
      <EmoteCategory title={__('Odysee')} images={ODYSEE_EMOTES} {...defaultRowProps} />
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
    <div className="selector-menu">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />

      {false && (
        <>
          <div className="emote-categories">
            <Icon icon={ICONS.TIME} />
            <img
              src="https://thumbnails.odycdn.com/optimize/s:200:0/quality:95/plain/https://thumbnails.lbry.com/UCMvVQIAfsGwzrfPLxiaIG8g"
              style={{ borderRadius: '50%' }}
            />
            <img src="https://static.odycdn.com/stickers/MISC/PNG/fire.png" />
            <img src="https://static.odycdn.com/stickers/TIPS/png/with%20borderlarge$tip.png" />
          </div>
          <StickerCategory title={__('Recently used')} {...defaultRowProps} />
          <StickerCategory title={__('Member exclusive')} {...defaultRowProps} />
        </>
      )}

      <StickerCategory title={__('Free')} images={FREE_GLOBAL_STICKERS} {...defaultRowProps} />
      {!claimIsMine && <StickerCategory title={__('Tips')} images={PAID_GLOBAL_STICKERS} {...defaultRowProps} />}
    </div>
  );
};

type RowProps = {
  title: string,
  images?: any,
  handleSelect: (string) => void,
};

const EmoteCategory = (rowProps: RowProps) => {
  const { images, handleSelect } = rowProps;

  return (
    <>
      {/*
      <label id={title} className="chatImage-category-title">
        {title}
      </label>
      */}
      <div className="emote-selector__items">
        {images &&
          images.map((emote) => {
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
    </>
  );
};

const StickerCategory = (rowProps: RowProps) => {
  const { images, handleSelect } = rowProps;

  return (
    <div>
      {/*
        <label id={title} className="chatImage-category-title">
          {title}
        </label>
      */}

      <div className="sticker-selector__items">
        {images &&
          images.map((sticker) => {
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
