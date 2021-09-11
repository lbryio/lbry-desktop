// @flow
import * as ICONS from 'constants/icons';
import { BLOCK_LEVEL } from 'constants/comment';
import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import ChannelBlockButton from 'component/channelBlockButton';
import ChannelMuteButton from 'component/channelMuteButton';
import Yrbl from 'component/yrbl';

const VIEW = {
  BLOCKED: 'blocked',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MUTED: 'muted',
};

type Props = {
  mutedUris: ?Array<string>,
  personalBlockList: ?Array<string>,
  adminBlockList: ?Array<string>,
  moderatorBlockList: ?Array<string>,
  personalTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  adminTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  moderatorTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  moderatorBlockListDelegatorsMap: { [string]: Array<string> },
  fetchingModerationBlockList: boolean,
  fetchModBlockedList: () => void,
  fetchModAmIList: () => void,
  delegatorsById: { [string]: { global: boolean, delegators: { name: string, claimId: string } } },
  myChannelClaims: ?Array<ChannelClaim>,
};

function ListBlocked(props: Props) {
  const {
    mutedUris,
    personalBlockList,
    adminBlockList,
    moderatorBlockList,
    personalTimeoutMap,
    adminTimeoutMap,
    moderatorTimeoutMap,
    moderatorBlockListDelegatorsMap,
    fetchingModerationBlockList,
    fetchModBlockedList,
    fetchModAmIList,
    delegatorsById,
    myChannelClaims,
  } = props;
  const [viewMode, setViewMode] = usePersistedState('blocked-muted:display', VIEW.BLOCKED);

  // Keep a local list to allow for undoing actions in this component
  const [localPersonalList, setLocalPersonalList] = React.useState(undefined);
  const [localAdminList, setLocalAdminList] = React.useState(undefined);
  const [localModeratorList, setLocalModeratorList] = React.useState(undefined);
  const [localModeratorListDelegatorsMap, setLocalModeratorListDelegatorsMap] = React.useState(undefined);
  const [localMutedList, setLocalMutedList] = React.useState(undefined);

  const hasLocalMuteList = localMutedList && localMutedList.length > 0;
  const hasLocalPersonalList = localPersonalList && localPersonalList.length > 0;

  const stringifiedMutedList = JSON.stringify(mutedUris);
  const stringifiedPersonalList = JSON.stringify(personalBlockList);
  const stringifiedAdminList = JSON.stringify(adminBlockList);
  const stringifiedModeratorList = JSON.stringify(moderatorBlockList);
  const stringifiedModeratorListDelegatorsMap = JSON.stringify(moderatorBlockListDelegatorsMap);

  const stringifiedLocalAdminList = JSON.stringify(localAdminList);
  const stringifiedLocalModeratorList = JSON.stringify(localModeratorList);
  const stringifiedLocalModeratorListDelegatorsMap = JSON.stringify(localModeratorListDelegatorsMap);

  const justMuted = localMutedList && mutedUris && localMutedList.length < mutedUris.length;
  const justPersonalBlocked =
    localPersonalList && personalBlockList && localPersonalList.length < personalBlockList.length;

  const isAdmin =
    myChannelClaims && myChannelClaims.some((c) => delegatorsById[c.claim_id] && delegatorsById[c.claim_id].global);
  const isModerator =
    myChannelClaims &&
    myChannelClaims.some(
      (c) => delegatorsById[c.claim_id] && Object.keys(delegatorsById[c.claim_id].delegators).length > 0
    );

  const listForView = getLocalList(viewMode);
  const showUris = listForView && listForView.length > 0;

  function getLocalList(view) {
    switch (view) {
      case VIEW.BLOCKED:
        return localPersonalList;
      case VIEW.ADMIN:
        return localAdminList;
      case VIEW.MODERATOR:
        return localModeratorList;
      case VIEW.MUTED:
        return localMutedList;
    }
  }

  function getButtons(view, uri) {
    const getDurationStr = (durationNs) => {
      const NANO_TO_MS = 1000000;
      return humanizeDuration(durationNs / NANO_TO_MS, { round: true });
    };

    const getBanInfoElem = (timeoutInfo) => {
      return (
        <div>
          <div className="help">
            <blockquote>
              {moment(timeoutInfo.blockedAt).format('MMMM Do, YYYY @ HH:mm')}
              <br />
              {getDurationStr(timeoutInfo.bannedFor)}{' '}
              {__('(Remaining: %duration%) --[timeout ban duration]--', {
                duration: getDurationStr(timeoutInfo.banRemaining),
              })}
            </blockquote>
          </div>
        </div>
      );
    };

    switch (view) {
      case VIEW.BLOCKED:
        return (
          <>
            <ChannelBlockButton uri={uri} />
            <ChannelMuteButton uri={uri} />
            {personalTimeoutMap[uri] && getBanInfoElem(personalTimeoutMap[uri])}
          </>
        );

      case VIEW.ADMIN:
        return (
          <>
            <ChannelBlockButton uri={uri} blockLevel={BLOCK_LEVEL.ADMIN} />
            {adminTimeoutMap[uri] && getBanInfoElem(adminTimeoutMap[uri])}
          </>
        );

      case VIEW.MODERATOR:
        const delegatorUrisForBlockedUri = localModeratorListDelegatorsMap && localModeratorListDelegatorsMap[uri];
        if (!delegatorUrisForBlockedUri) return null;
        return (
          <>
            {delegatorUrisForBlockedUri.map((delegatorUri) => {
              return (
                <div className="block-list--delegator" key={delegatorUri}>
                  <ul className="section content__non-clickable">
                    <ClaimPreview uri={delegatorUri} hideMenu hideActions type="small" />
                  </ul>
                  <ChannelBlockButton uri={uri} blockLevel={BLOCK_LEVEL.MODERATOR} creatorUri={delegatorUri} />
                  {moderatorTimeoutMap[uri] && getBanInfoElem(moderatorTimeoutMap[uri])}
                </div>
              );
            })}
          </>
        );

      case VIEW.MUTED:
        return (
          <>
            <ChannelMuteButton uri={uri} />
            <ChannelBlockButton uri={uri} />
          </>
        );
    }
  }

  function getHelpText(view) {
    switch (view) {
      case VIEW.BLOCKED:
        return "Blocked channels will be invisible to you in the app. They will not be able to comment on your content, nor reply to your comments left on other channels' content.";
      case VIEW.ADMIN:
        return 'This is the global block list.';
      case VIEW.MODERATOR:
        return 'List of channels that you have blocked as a moderator, along with the list of delegators.';
      case VIEW.MUTED:
        return 'Muted channels will be invisible to you in the app. They will not know they are muted and can still interact with you and your content.';
    }
  }

  function getEmptyListTitle(view) {
    switch (view) {
      case VIEW.BLOCKED:
        return 'You do not have any blocked channels';
      case VIEW.MUTED:
        return 'You do not have any muted channels';
      case VIEW.ADMIN:
        return 'You do not have any globally-blocked channels';
      case VIEW.MODERATOR:
        return 'You do not have any blocked channels as a moderator';
    }
  }

  function getEmptyListSubtitle(view) {
    switch (view) {
      case VIEW.BLOCKED:
      case VIEW.MUTED:
        return getHelpText(view);

      case VIEW.ADMIN:
      case VIEW.MODERATOR:
        return null;
    }
  }

  function isSourceListLarger(source, local) {
    // Comparing the length of stringified is not perfect, but what are the
    // chances of having different lists with the exact same length?
    return source && (!local || local.length < source.length);
  }

  React.useEffect(() => {
    const jsonMutedChannels = stringifiedMutedList && JSON.parse(stringifiedMutedList);
    if (!hasLocalMuteList && jsonMutedChannels && jsonMutedChannels.length > 0) {
      setLocalMutedList(jsonMutedChannels);
    }
  }, [stringifiedMutedList, hasLocalMuteList]);

  React.useEffect(() => {
    const jsonBlockedChannels = stringifiedPersonalList && JSON.parse(stringifiedPersonalList);
    if (!hasLocalPersonalList && jsonBlockedChannels && jsonBlockedChannels.length > 0) {
      setLocalPersonalList(jsonBlockedChannels);
    }
  }, [stringifiedPersonalList, hasLocalPersonalList]);

  React.useEffect(() => {
    if (stringifiedAdminList && isSourceListLarger(stringifiedAdminList, stringifiedLocalAdminList)) {
      setLocalAdminList(JSON.parse(stringifiedAdminList));
    }
  }, [stringifiedAdminList, stringifiedLocalAdminList]);

  React.useEffect(() => {
    if (stringifiedModeratorList && isSourceListLarger(stringifiedModeratorList, stringifiedLocalModeratorList)) {
      setLocalModeratorList(JSON.parse(stringifiedModeratorList));
    }
  }, [stringifiedModeratorList, stringifiedLocalModeratorList]);

  React.useEffect(() => {
    if (
      stringifiedModeratorListDelegatorsMap &&
      isSourceListLarger(stringifiedModeratorListDelegatorsMap, stringifiedLocalModeratorListDelegatorsMap)
    ) {
      setLocalModeratorListDelegatorsMap(JSON.parse(stringifiedModeratorListDelegatorsMap));
    }
  }, [stringifiedModeratorListDelegatorsMap, stringifiedLocalModeratorListDelegatorsMap]);

  React.useEffect(() => {
    if (justMuted && stringifiedMutedList) {
      setLocalMutedList(JSON.parse(stringifiedMutedList));
    }
  }, [stringifiedMutedList, justMuted, setLocalMutedList]);

  React.useEffect(() => {
    if (justPersonalBlocked && stringifiedPersonalList) {
      setLocalPersonalList(JSON.parse(stringifiedPersonalList));
    }
  }, [stringifiedPersonalList, justPersonalBlocked, setLocalPersonalList]);

  return (
    <Page
      noFooter
      noSideNavigation
      settingsPage
      backout={{ title: __('Blocked and muted channels'), backLabel: __('Back') }}
    >
      {fetchingModerationBlockList && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}

      {!fetchingModerationBlockList && (
        <>
          <div className="section__header--actions">
            <div className="section__actions--inline">
              <Button
                icon={ICONS.BLOCK}
                button="alt"
                label={__('Blocked')}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': viewMode === VIEW.BLOCKED,
                })}
                onClick={() => setViewMode(VIEW.BLOCKED)}
              />
              {isAdmin && (
                <Button
                  icon={ICONS.BLOCK}
                  button="alt"
                  label={__('Global')}
                  className={classnames(`button-toggle`, {
                    'button-toggle--active': viewMode === VIEW.ADMIN,
                  })}
                  onClick={() => setViewMode(VIEW.ADMIN)}
                />
              )}
              {isModerator && (
                <Button
                  icon={ICONS.BLOCK}
                  button="alt"
                  label={__('Moderator')}
                  className={classnames(`button-toggle`, {
                    'button-toggle--active': viewMode === VIEW.MODERATOR,
                  })}
                  onClick={() => setViewMode(VIEW.MODERATOR)}
                />
              )}
              <Button
                icon={ICONS.MUTE}
                button="alt"
                label={__('Muted')}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': viewMode === VIEW.MUTED,
                })}
                onClick={() => setViewMode(VIEW.MUTED)}
              />
            </div>
            <div className="section__actions--inline">
              <Button
                icon={ICONS.REFRESH}
                button="alt"
                label={__('Refresh')}
                onClick={() => {
                  fetchModBlockedList();
                  fetchModAmIList();
                }}
              />
            </div>
          </div>

          {showUris && <div className="help--notice">{getHelpText(viewMode)}</div>}

          {showUris ? (
            <div className={viewMode === VIEW.MODERATOR ? 'block-list--moderator' : 'block-list'}>
              <ClaimList
                uris={getLocalList(viewMode)}
                showUnresolvedClaims
                showHiddenByUser
                hideMenu
                renderActions={(claim) => {
                  return <div className="section__actions">{getButtons(viewMode, claim.permanent_url)}</div>;
                }}
              />
            </div>
          ) : (
            <div className="main--empty">
              <Yrbl
                title={getEmptyListTitle(viewMode)}
                subtitle={getEmptyListSubtitle(viewMode)}
                actions={
                  <div className="section__actions">
                    <Button button="primary" label={__('Go Home')} navigate="/" />
                  </div>
                }
              />
            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default ListBlocked;
