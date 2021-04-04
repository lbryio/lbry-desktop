// @flow
import * as React from 'react';
import FileAuthor from 'component/fileAuthor';
import FileTitle from 'component/fileTitle';
import FileActions from 'component/fileActions';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileViewCount from 'component/fileViewCount';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';

type Props = {
  uri: string,
  claim: ?StreamClaim,
};

function PostViewer(props: Props) {
  const { uri, claim } = props;

  if (!claim) {
    return null;
  }

  const amount = parseFloat(claim.amount) + parseFloat(claim.meta.support_amount);

  return (
    <div className="post">
      <FileTitle uri={uri} className="post__title">
        <span className="post__date">
          <DateTime uri={uri} show={DateTime.SHOW_DATE} />
        </span>
      </FileTitle>
      <div className="post__info">
        <CreditAmount amount={amount} />
        <FileViewCount uri={uri} />
      </div>

      <FileAuthor uri={uri} />

      <FileRenderInitiator uri={uri} />
      <FileRenderInline uri={uri} />
      <FileActions uri={uri} />
    </div>
  );
}

export default PostViewer;
