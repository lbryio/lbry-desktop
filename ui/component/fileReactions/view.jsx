// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { formatNumberWithCommas } from 'util/number';

type Props = {
  claim: StreamClaim,
  doFetchReactions: string => void,
  doReactionLike: string => void,
  doReactionDislike: string => void,
  uri: string,
  likeCount: number,
  dislikeCount: number,
  myReaction: ?string,
};

function FileReactions(props: Props) {
  const { claim, uri, doFetchReactions, doReactionLike, doReactionDislike, likeCount, dislikeCount } = props;
  const claimId = claim && claim.claim_id;

  React.useEffect(() => {
    if (claimId) {
      doFetchReactions(claimId);
    }
  }, [claimId, doFetchReactions]);

  return (
    <>
      <Button
        title={__('I like this')}
        requiresAuth
        className={classnames('button--file-action')}
        label={formatNumberWithCommas(likeCount)}
        iconSize={18}
        icon={ICONS.UPVOTE}
        onClick={() => doReactionLike(uri)}
      />
      <Button
        requiresAuth
        title={__('I dislike this')}
        className={classnames('button--file-action')}
        label={formatNumberWithCommas(dislikeCount)}
        iconSize={18}
        icon={ICONS.DOWNVOTE}
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

export default FileReactions;
