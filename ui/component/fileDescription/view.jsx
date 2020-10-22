// @flow
import React from 'react';
import classnames from 'classnames';
import { formatCredits } from 'lbry-redux';
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
  user: ?any,
  tags: any,
  pendingAmount: number,
};

function FileDescription(props: Props) {
  const { uri, claim, metadata, tags, pendingAmount } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [showCreditDetails, setShowCreditDetails] = React.useState(false);
  const amount = parseFloat(claim.amount) + parseFloat(pendingAmount || claim.meta.support_amount);
  const formattedAmount = formatCredits(amount, 2, true);

  if (!claim || !metadata) {
    return <span className="empty">{__('Empty claim or metadata info.')}</span>;
  }

  const { description } = metadata;

  if (!description && !(tags && tags.length)) return null;

  return (
    <div>
      <div
        className={classnames({
          'media__info-text--contracted': !expanded,
          'media__info-text--expanded': expanded,
          'media__info-text--fade': !expanded,
        })}
      >
        <MarkdownPreview className="markdown-preview--description" content={description} simpleLinks />
        <ClaimTags uri={uri} type="large" />
        <FileDetails uri={uri} />
      </div>

      <div className="section__actions--between">
        {expanded ? (
          <Button button="link" label={__('Less')} onClick={() => setExpanded(!expanded)} />
        ) : (
          <Button button="link" label={__('More')} onClick={() => setExpanded(!expanded)} />
        )}

        <Button button="link" onClick={() => setShowCreditDetails(!showCreditDetails)}>
          <LbcSymbol postfix={showCreditDetails ? __('Hide') : formattedAmount} />
        </Button>
      </div>

      {showCreditDetails && (
        <div className="section">
          <FileValues uri={uri} />
        </div>
      )}
    </div>
  );
}

export default FileDescription;
