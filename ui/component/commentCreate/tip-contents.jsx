// @flow
import 'scss/component/_comment-selectors.scss';

import Button from 'component/button';
import React from 'react';
import ChannelThumbnail from 'component/channelThumbnail';
import UriIndicator from 'component/uriIndicator';
import CreditAmount from 'component/common/credit-amount';

const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type Props = {
  activeChannelUrl: string,
  tipAmount: number,
  activeTab: string,
  message: string,
  isReviewingStickerComment?: boolean,
  stickerPreviewComponent?: any,
};

export const TipReviewBox = (props: Props) => {
  const { activeChannelUrl, tipAmount, activeTab, message, isReviewingStickerComment, stickerPreviewComponent } = props;

  return (
    <div className="commentCreate__supportCommentPreview">
      <CreditAmount
        amount={tipAmount}
        className="commentCreate__supportCommentPreviewAmount"
        isFiat={activeTab === TAB_FIAT}
        size={activeTab === TAB_LBC ? 18 : 2}
      />

      {isReviewingStickerComment ? (
        stickerPreviewComponent
      ) : (
        <>
          <ChannelThumbnail xsmall uri={activeChannelUrl} />

          <div className="commentCreate__supportCommentBody">
            <UriIndicator uri={activeChannelUrl} link />
            <div>{message}</div>
          </div>
        </>
      )}
    </div>
  );
};

type TipButtonProps = {
  name: string,
  tab: string,
  activeTab: string,
  tipSelectorOpen: boolean,
  onClick: (tab: string) => void,
};

export const TipActionButton = (tipButtonProps: TipButtonProps) => {
  const { name, tab, activeTab, tipSelectorOpen, onClick, ...buttonProps } = tipButtonProps;

  return (
    (!tipSelectorOpen || activeTab !== tab) && (
      <Button
        {...buttonProps}
        title={name}
        label={tipSelectorOpen ? __('Switch to %tip_method%', { tip_method: name }) : undefined}
        onClick={() => onClick(tab)}
      />
    )
  );
};
