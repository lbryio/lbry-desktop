// @flow
import * as React from 'react';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import { formatCredits } from 'util/format-credits';
import FileDetails from 'component/fileDetails';
import ClaimAuthor from 'component/claimAuthor';
import FileTitle from 'component/fileTitle';
import FileActions from 'component/fileActions';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileValues from 'component/fileValues';
import FileViewCount from 'component/fileViewCount';
import ClaimTags from 'component/claimTags';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import LbcSymbol from 'component/common/lbc-symbol';
import classnames from 'classnames';

const EXPAND = {
  NONE: 'none',
  CREDIT_DETAILS: 'credit_details',
  FILE_DETAILS: 'file_details',
};

type Props = {
  uri: string,
  claim: ?StreamClaim,
  claimIsMine: boolean,
  doOpenModal: (id: string, {}) => void,
};

function PostViewer(props: Props) {
  const { uri, claim, claimIsMine, doOpenModal } = props;
  const [expand, setExpand] = React.useState(EXPAND.NONE);

  if (!claim) {
    return null;
  }

  const amount = parseFloat(claim.amount) + parseFloat(claim.meta.support_amount);
  const formattedAmount = formatCredits(amount, 2, true);
  const hasSupport = claim && claim.meta && claim.meta.support_amount && Number(claim.meta.support_amount) > 0;

  function handleExpand(newExpand) {
    if (expand === newExpand) {
      setExpand(EXPAND.NONE);
    } else {
      setExpand(newExpand);
    }
  }

  return (
    <div className="post">
      <FileTitle uri={uri} className="post__title" />
      <div
        className={classnames('post__info', {
          'post__info--expanded': expand !== EXPAND.NONE,
        })}
      >
        <span className="post__date">
          <DateTime uri={uri} type="date" />
          <FileViewCount uri={uri} />
        </span>
        <div className="post__info--grouped">
          <Button
            button="link"
            className="dim"
            icon={ICONS.INFO}
            aria-label={__('View claim details')}
            onClick={() => handleExpand(EXPAND.FILE_DETAILS)}
          />
          <Button button="link" className="dim" onClick={() => handleExpand(EXPAND.CREDIT_DETAILS)}>
            <LbcSymbol postfix={expand === EXPAND.CREDIT_DETAILS ? __('Hide') : formattedAmount} />
          </Button>
          {claimIsMine && hasSupport && (
            <Button
              button="link"
              className="expandable__button"
              icon={ICONS.UNLOCK}
              aria-label={__('Unlock tips')}
              onClick={() => {
                doOpenModal(MODALS.LIQUIDATE_SUPPORTS, { uri });
              }}
            />
          )}
        </div>
      </div>

      {expand === EXPAND.CREDIT_DETAILS && (
        <div className="section post__info--credit-details">
          <FileValues uri={uri} />
        </div>
      )}

      {expand === EXPAND.FILE_DETAILS && (
        <div className="section post__info--credit-details">
          <ClaimTags uri={uri} type="large" />
          <FileDetails uri={uri} />
        </div>
      )}

      <ClaimAuthor uri={uri} />

      <div className="file-render--post-container">
        <FileRenderInitiator uri={uri} />
        <FileRenderInline uri={uri} />
      </div>
      <FileActions uri={uri} />
    </div>
  );
}

export default PostViewer;
