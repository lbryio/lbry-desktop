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

type Props = {
  uri: string,
  claim: StreamClaim,
  metadata: StreamMetadata,
  tags: any,
  pendingAmount: number,
  doOpenModal: (id: string, arg2: Record<any, any>) => void,
  claimIsMine: boolean,
  expandOverride: boolean
};

function FileDescription(props: Props) {
  const { uri, claim, metadata, pendingAmount, doOpenModal, claimIsMine, expandOverride } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [showCreditDetails, setShowCreditDetails] = React.useState(false);
// @ts-expect-error - TS2345 - Argument of type 'string | number' is not assignable to parameter of type 'string'.
  const amount = claim ? parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount) : undefined;
  const formattedAmount = formatCredits(amount, 2, true);
  const hasSupport = claim && claim.meta && claim.meta.support_amount && Number(claim.meta.support_amount) > 0;

  if (!claim || !metadata) {
    return <span className="empty">{__('Empty claim or metadata info.')}</span>;
  }

  const { description } = metadata;

  return (
    <div>
      <div
        className={classnames({
          'media__info-text--contracted': !expanded && !expandOverride,
          'media__info-text--expanded': expanded,
          'media__info-text--fade': !expanded && !expandOverride,
        })}
      >
        {description && <MarkdownPreview className="markdown-preview--description" content={description} simpleLinks />}
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <ClaimTags uri={uri} type="large" />
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <FileDetails uri={uri} />
      </div>

      <div className="card__bottom-actions">
        {!expandOverride && (
          <>
            {expanded ? (
              // @ts-expect-error - TS2322 (ts-migration)
              <Button button="link" label={__('Less')} onClick={() => setExpanded(!expanded)} />
            ) : (
              // @ts-expect-error - TS2322 (ts-migration)
              <Button button="link" label={__('More')} onClick={() => setExpanded(!expanded)} />
            )}
          </>
        )}

        <div className="section__actions--no-margin">
          {claimIsMine && hasSupport && (
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="link"
              className="expandable__button"
              icon={ICONS.UNLOCK}
              aria-label={__('Unlock tips')}
              onClick={() => {
                doOpenModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
              }}
            />
          )}
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" onClick={() => setShowCreditDetails(!showCreditDetails)}>
            <LbcSymbol postfix={showCreditDetails ? __('Hide') : formattedAmount} />
          </Button>
        </div>
      </div>

      {showCreditDetails && (
        <div className="section">
          {/* @ts-expect-error - TS2741 (ts-migration) */}
          <FileValues uri={uri} />
        </div>
      )}
    </div>
  );
}

export default FileDescription;
