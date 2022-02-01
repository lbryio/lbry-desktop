// @flow
import * as REACTION_TYPES from 'constants/reactions';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import { formatNumberWithCommas } from 'util/number';
import NudgeFloating from 'component/nudgeFloating';
import Tooltip from 'component/common/tooltip';

const LIVE_REACTION_FETCH_MS = 1000 * 45;

type Props = {
  uri: string,
  // redux
  claimId?: string,
  channelName?: string,
  isCollection?: boolean,
  likeCount: number,
  dislikeCount: number,
  myReaction: ?string,
  isLivestreamClaim?: boolean,
  doFetchReactions: (claimId: ?string) => void,
  doReactionLike: (uri: string) => void,
  doReactionDislike: (uri: string) => void,
};

export default function FileReactions(props: Props) {
  const {
    uri,
    claimId,
    channelName,
    isCollection,
    myReaction,
    likeCount,
    dislikeCount,
    isLivestreamClaim,
    doFetchReactions,
    doReactionLike,
    doReactionDislike,
  } = props;

  const likeIcon = myReaction === REACTION_TYPES.LIKE ? ICONS.FIRE_ACTIVE : ICONS.FIRE;
  const dislikeIcon = myReaction === REACTION_TYPES.DISLIKE ? ICONS.SLIME_ACTIVE : ICONS.SLIME;

  const likeLabel = (
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
      {formatNumberWithCommas(likeCount, 0)}
    </>
  );

  const dislikeLabel = (
    <>
      {myReaction === REACTION_TYPES.DISLIKE && (
        <>
          <div className="button__slime-stain" />
          <div className="button__slime-drop1" />
          <div className="button__slime-drop2" />
        </>
      )}
      {formatNumberWithCommas(dislikeCount, 0)}
    </>
  );

  React.useEffect(() => {
    function fetchReactions() {
      doFetchReactions(claimId);
    }

    let fetchInterval;
    if (claimId) {
      fetchReactions();

      if (isLivestreamClaim) {
        fetchInterval = setInterval(fetchReactions, LIVE_REACTION_FETCH_MS);
      }
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [claimId, doFetchReactions, isLivestreamClaim]);

  return (
    <>
      {channelName && !isCollection && (
        <NudgeFloating
          name="nudge:support-acknowledge"
          text={__('Let %channel% know you enjoyed this!', { channel: channelName })}
        />
      )}

      <FileReaction
        title={__('I like this')}
        label={likeLabel}
        icon={likeIcon}
        isActive={myReaction === REACTION_TYPES.LIKE}
        activeClassName="button--fire"
        onClick={() => doReactionLike(uri)}
      />

      <FileReaction
        title={__('I dislike this')}
        label={dislikeLabel}
        icon={dislikeIcon}
        isActive={myReaction === REACTION_TYPES.DISLIKE}
        activeClassName="button--slime"
        onClick={() => doReactionDislike(uri)}
      />
    </>
  );
}

type ReactionProps = {
  title: string,
  label: any,
  icon: string,
  isActive: boolean,
  activeClassName: string,
  onClick: () => void,
};

const FileReaction = (reactionProps: ReactionProps) => {
  const { title, label, icon, isActive, activeClassName, onClick } = reactionProps;

  return (
    <Tooltip title={title} arrow={false}>
      <div style={{ margin: '0' }}>
        <Button
          requiresAuth
          authSrc="filereaction_like"
          className={classnames('button--file-action', { [activeClassName]: isActive })}
          label={label}
          iconSize={18}
          icon={icon}
          onClick={onClick}
        />
      </div>
    </Tooltip>
  );
};
