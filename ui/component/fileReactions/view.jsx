// @flow
import * as REACTION_TYPES from 'constants/reactions';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { formatNumber } from 'util/number';
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
  const { claim, uri, doFetchReactions, doReactionLike, doReactionDislike, myReaction, likeCount, dislikeCount } =
    props;

  const claimId = claim && claim.claim_id;
  const channel = claim && claim.signing_channel && claim.signing_channel.name;
  const isCollection = claim && claim.value_type === 'collection'; // hack because nudge gets cut off by card on cols.
  const likeIcon = ICONS.UPVOTE;
  const dislikeIcon = ICONS.DOWNVOTE;
  React.useEffect(() => {
    function fetchReactions() {
      doFetchReactions(claimId);
    }

    if (claimId) {
      fetchReactions();
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
        authSrc="filereaction_like"
        className={classnames('button--file-action button-like', {
          'button--file-action-active': myReaction === REACTION_TYPES.LIKE,
        })}
        label={<>{formatNumber(likeCount, 2, true)}</>}
        iconSize={18}
        icon={likeIcon}
        onClick={() => doReactionLike(uri)}
      />
      <Button
        authSrc={'filereaction_dislike'}
        title={__('I dislike this')}
        className={classnames('button--file-action button-dislike', {
          'button--file-action-active': myReaction === REACTION_TYPES.DISLIKE,
        })}
        label={<>{formatNumber(dislikeCount, 2, true)}</>}
        iconSize={18}
        icon={dislikeIcon}
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

export default FileReactions;
