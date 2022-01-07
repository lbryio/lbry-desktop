// @flow
import * as REACTION_TYPES from 'constants/reactions';
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
  const {
    claim,
    uri,
    doFetchReactions,
    doReactionLike,
    doReactionDislike,
    myReaction,
    likeCount,
    dislikeCount,
  } = props;

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
        className={classnames('button--file-action', {
          'button--file-action-active': myReaction === REACTION_TYPES.LIKE,
        })}
        label={
          <>
            {/* Be nice to have animated Likes */}
            {/* {myReaction === REACTION_TYPES.LIKE && SIMPLE_SITE && ( */}
            {/*  <> */}
            {/*    <div className="button__fire-glow" /> */}
            {/*    <div className="button__fire-particle1" /> */}
            {/*    <div className="button__fire-particle2" /> */}
            {/*    <div className="button__fire-particle3" /> */}
            {/*    <div className="button__fire-particle4" /> */}
            {/*    <div className="button__fire-particle5" /> */}
            {/*    <div className="button__fire-particle6" /> */}
            {/*  </> */}
            {/* )} */}
            {formatNumberWithCommas(likeCount, 0)}
          </>
        }
        iconSize={18}
        icon={likeIcon}
        onClick={() => doReactionLike(uri)}
      />
      <Button
        authSrc={'filereaction_dislike'}
        title={__('I dislike this')}
        className={classnames('button--file-action', {
          'button--file-action-active': myReaction === REACTION_TYPES.DISLIKE,
        })}
        label={<>{formatNumberWithCommas(dislikeCount, 0)}</>}
        iconSize={18}
        icon={dislikeIcon}
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

export default FileReactions;
