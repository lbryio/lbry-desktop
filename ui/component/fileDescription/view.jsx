// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import React from 'react';
import classnames from 'classnames';
import { formatCredits } from 'util/format-credits';
import MarkdownPreview from 'component/common/markdown-preview';
import ClaimTags from 'component/claimTags';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import FileDetails from 'component/fileDetails';
import FileValues from 'component/fileValues';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  uri: string,
  expandOverride: boolean,
  // redux
  description?: string,
  amount: number,
  hasSupport?: boolean,
  isEmpty: boolean,
  claimIsMine: boolean,
  pendingAmount: number,
  doOpenModal: (id: string, {}) => void,
};

export default function FileDescription(props: Props) {
  const { uri, description, amount, hasSupport, isEmpty, doOpenModal, claimIsMine, expandOverride } = props;

  const isMobile = useIsMobile();

  const [expanded, setExpanded] = React.useState(false);
  const [showCreditDetails, setShowCreditDetails] = React.useState(false);

  const formattedAmount = formatCredits(amount, 2, true);

  if (isEmpty) {
    return <span className="empty">{__('Empty claim or metadata info.')}</span>;
  }

  return (
    <>
      <div
        className={classnames({
          'media__info-text--contracted media__info-text--fade': !expanded && !expandOverride,
          'media__info-text--expanded': expanded,
        })}
      >
        {isMobile && <ClaimTags uri={uri} type="large" />}

        <div className="mediaInfo__description">
          {description && (
            <MarkdownPreview className="markdown-preview--description" content={description} simpleLinks />
          )}
          {!isMobile && <ClaimTags uri={uri} type="large" />}
          <FileDetails uri={uri} />
        </div>
      </div>

      <div className="card__bottom-actions">
        {!expandOverride && (
          <Button button="link" label={expanded ? __('Less') : __('More')} onClick={() => setExpanded(!expanded)} />
        )}

        <div className="section__actions--no-margin">
          {claimIsMine && hasSupport && (
            <Button
              button="link"
              className="expandable__button"
              icon={ICONS.UNLOCK}
              aria-label={__('Unlock tips')}
              onClick={() => doOpenModal(MODALS.LIQUIDATE_SUPPORTS, { uri })}
            />
          )}

          <Button button="link" onClick={() => setShowCreditDetails(!showCreditDetails)}>
            <LbcSymbol postfix={showCreditDetails ? __('Hide') : formattedAmount} />
          </Button>
        </div>
      </div>

      {showCreditDetails && <FileValues uri={uri} />}
    </>
  );
}
