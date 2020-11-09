// @flow
import * as REACTION_TYPES from 'constants/reactions';
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
        className={classnames('button--file-action', { 'button--fire': myReaction === REACTION_TYPES.LIKE })}
        label={
          <>
            {myReaction === REACTION_TYPES.LIKE && (
              <>
                <div className="button__fire-glow" />
                <div className="button__fire-particle1" />
                <div className="button__fire-particle2" />
                <div className="button__fire-particle3" />
                <div className="button__fire-particle4" />
                <div className="button__fire-particle5" />
                <div className="button__fire-particle6" />
              </>
            )}
            {formatNumberWithCommas(likeCount)}
          </>
        }
        iconSize={18}
        icon={myReaction === REACTION_TYPES.LIKE ? ICONS.FIRE_ACTIVE : ICONS.FIRE}
        onClick={() => doReactionLike(uri)}
      />
      <Button
        requiresAuth
        title={__('I dislike this')}
        className={classnames('button--file-action', { 'button--slime': myReaction === REACTION_TYPES.DISLIKE })}
        label={
          <>
            {myReaction === REACTION_TYPES.DISLIKE && (
              <>
                <div className="button__slime-stain" />
                <div className="button__slime-drop1" />
                <div className="button__slime-drop2" />
              </>
            )}
            {formatNumberWithCommas(dislikeCount)}{' '}
          </>
        }
        iconSize={18}
        icon={myReaction === REACTION_TYPES.DISLIKE ? ICONS.SLIME_ACTIVE : ICONS.SLIME}
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

export default FileReactions;
