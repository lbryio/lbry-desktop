// @flow
import { EMOTES_48px as ODYSEE_EMOTES, TWEMOTES } from 'constants/emotes';
import * as ICONS from 'constants/icons';
// import Icon from 'component/common/icon';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';
import { useIsMobile } from 'effects/use-screensize';
import './style.scss';

export const SELECTOR_TABS = {
  EMOJI: 0,
  STICKER: 1,
};

type Props = {
  claimIsMine?: boolean,
  isOpen?: boolean,
  openTab?: number,
  addEmoteToComment: (string) => void,
  handleSelectSticker: (any) => void,
  closeSelector?: () => void,
};

export default function CommentSelectors(props: Props) {
  const { claimIsMine, isOpen, openTab, addEmoteToComment, handleSelectSticker, closeSelector } = props;
  const tabProps = { closeSelector };

  return (
    <Tabs index={openTab} className={isOpen ? 'tabs tabs--open' : 'tabs'} onChange={() => {}}>
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

function scrollToCategory(category, reference, isMobile) {
  const offset = isMobile ? 48 : 58;
  // $FlowIgnore
  let categoryAnchor = reference.current.querySelector('#' + category.replace(/\s|&/g, ''));
  reference &&
    categoryAnchor &&
    // $FlowIgnore
    reference.current.scrollTo({ top: categoryAnchor.offsetTop - offset, behavior: 'smooth' });
}

function handleHover(name) {
  let preview = document.getElementById('emoji-code-preview');
  if (preview) {
    preview.innerHTML = name;
    preview.style.display = 'inline';
    if (name) preview.style.display = 'inline';
    else preview.style.display = 'none';
  }
}

const EmojisPanel = (emojisProps: EmojisProps) => {
  const { handleSelect, closeSelector } = emojisProps;
  const defaultRowProps = { handleSelect };
  const isMobile = useIsMobile();
  const emojiSelectorRef = React.useRef();

  // prettier-ignore
  const CATEGORY_INFOS = [
    { key: 'odysee', name: 'Odysee', mainImg: '48%20px/smile%402x.png', images: ODYSEE_EMOTES },
    { key: 'smilies', name: __('Smilies'), mainImg: 'twemoji/smilies/grinning.png', images: TWEMOTES.SMILIES },
    { key: 'hand signals', name: __('Hand signals'), mainImg: 'twemoji/handsignals/waving_hand.png', images: TWEMOTES.HANDSIGNALS },
    { key: 'activities', name: __('Activities'), mainImg: 'twemoji/activities/tennis.png', images: TWEMOTES.ACTIVITIES },
    { key: 'symbols', name: __('Symbols'), mainImg: 'twemoji/symbols/sparkling_heart.png', images: TWEMOTES.SYMBOLS },
    { key: 'animals & nature', name: __('Animals & Nature'), mainImg: 'twemoji/nature/dolphin.png', images: TWEMOTES.NATURE },
    { key: 'food & drink', name: __('Food & Drink'), mainImg: 'twemoji/food/sushi.png', images: TWEMOTES.FOOD },
    { key: 'flags', name: __('Flags'), mainImg: 'twemoji/flags/pirate_flag.png', images: TWEMOTES.FLAGS },
  ];

  return (
    <div className="selector-menu" ref={emojiSelectorRef}>
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />
      <div id="emoji-code-preview" />
      <div className="emoji-categories">
        {/* <Icon icon={ICONS.TIME} /> */}
        {CATEGORY_INFOS.map((x) => (
          <img
            key={x.key}
            onClick={() => scrollToCategory(x.key, emojiSelectorRef, isMobile)}
            onMouseEnter={() => handleHover(x.name)}
            onMouseLeave={() => handleHover('')}
            loading="lazy"
            src={`https://static.odycdn.com/emoticons/${x.mainImg}`}
          />
        ))}
      </div>

      {/* <EmoteCategory title={__('Recently used')} {...defaultRowProps} /> */}
      {CATEGORY_INFOS.map((x) => (
        <EmoteCategory key={x.key} title={x.name} images={x.images} {...defaultRowProps} handleHover={handleHover} />
      ))}
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
  const stickerSelectorRef = React.useRef();
  const isMobile = useIsMobile();

  return (
    <div className="selector-menu" ref={stickerSelectorRef}>
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />
      <div id="emoji-code-preview" />
      <div className="emoji-categories">
        <img
          onClick={() => scrollToCategory('free', stickerSelectorRef, isMobile)}
          onMouseEnter={() => handleHover(__('Free'))}
          onMouseLeave={() => handleHover('')}
          loading="lazy"
          src="https://static.odycdn.com/stickers/HYPE/PNG/hype_with_border.png"
        />
        {!claimIsMine && (
          <img
            onClick={() => scrollToCategory('tips', stickerSelectorRef, isMobile)}
            onMouseEnter={() => handleHover(__('Tips'))}
            onMouseLeave={() => handleHover('')}
            loading="lazy"
            src="https://static.odycdn.com/stickers/TIPS/png/with%20borderlarge$tip.png"
          />
        )}
      </div>
      <StickerCategory
        title={__('Free')}
        images={FREE_GLOBAL_STICKERS}
        {...defaultRowProps}
        handleHover={handleHover}
      />
      {!claimIsMine && (
        <StickerCategory
          title={__('Tips')}
          images={PAID_GLOBAL_STICKERS}
          {...defaultRowProps}
          handleHover={handleHover}
        />
      )}
    </div>
  );
};

type RowProps = {
  title: string,
  images?: any,
  handleSelect: (string) => void,
  handleHover: (string) => void,
};

const EmoteCategory = (rowProps: RowProps) => {
  const { images, title, handleSelect, handleHover } = rowProps;

  return (
    <>
      <a id={title.replace(/\s|&/g, '').toLowerCase()}>
        <label id={title} className="chatImage-category-title">
          {title}
        </label>
      </a>

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
                onMouseEnter={() => handleHover(name)}
                onMouseLeave={() => handleHover('')}
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
  const { images, title, handleSelect, handleHover } = rowProps;

  return (
    <>
      <a id={title.replace(/\s|&/g, '').toLowerCase()}>
        <label id={title} className="chatImage-category-title">
          {title}
        </label>
      </a>
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
                onMouseEnter={() => handleHover(sticker)}
                onMouseLeave={() => handleHover('')}
              >
                <StickerWrapper price={price}>
                  <img src={url} loading="lazy" />
                  {price && price > 0 && <CreditAmount superChatLight amount={price} size={2} isFiat />}
                </StickerWrapper>
              </Button>
            );
          })}
      </div>
    </>
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
