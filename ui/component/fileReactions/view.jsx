// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { formatNumberWithCommas } from 'util/number';
import NudgeFloating from 'component/nudgeFloating';

type Props = {
  claim: StreamClaim,
  doFetchReactions: (string) => void,
  doReactionLike: (string) => void,
  doReactionDislike: (string) => void,
  uri: string,
  likeCount: number,
  dislikeCount: number,
  myReaction: ?string,
};

function FileReactions(props: Props) {
  const { claim, uri, doFetchReactions, doReactionLike, doReactionDislike, likeCount, dislikeCount } = props;
  const claimId = claim && claim.claim_id;
  const channel = claim && claim.signing_channel && claim.signing_channel.name;
  const isCollection = claim && claim.value_type === 'collection'; // hack because nudge gets cut off by card on cols.
  React.useEffect(() => {
    if (claimId) {
      doFetchReactions(claimId);
    }
  }, [claimId, doFetchReactions]);

  return (
    <>
      {channel && !isCollection && (
        <NudgeFloating
          name="nudge:support-acknowledge"
          text={__('Let %channel% know you enjoyed this!', { channel })}
        />
      )}

      <Button
        title={__('I like this')}
        requiresAuth={IS_WEB}
        authSrc="filereaction_like"
        className={classnames('button--file-action')}
        label={formatNumberWithCommas(likeCount, 0)}
        iconSize={18}
        icon={ICONS.UPVOTE}
        onClick={() => doReactionLike(uri)}
      />
      <Button
        requiresAuth={IS_WEB}
        authSrc={'filereaction_dislike'}
        title={__('I dislike this')}
        className={classnames('button--file-action')}
        label={formatNumberWithCommas(dislikeCount, 0)}
        iconSize={18}
        icon={ICONS.DOWNVOTE}
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

export default FileReactions;
