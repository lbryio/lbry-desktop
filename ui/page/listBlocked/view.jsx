// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import usePrevious from 'effects/use-previous';
import usePersistedState from 'effects/use-persisted-state';
import ChannelBlockButton from 'component/channelBlockButton';
import ChannelMuteButton from 'component/channelMuteButton';

type Props = {
  mutedUris: ?Array<string>,
  blockedUris: ?Array<string>,
  fetchingModerationBlockList: boolean,
};

const VIEW_BLOCKED = 'blocked';
const VIEW_MUTED = 'muted';

function ListBlocked(props: Props) {
  const { mutedUris, blockedUris, fetchingModerationBlockList } = props;

  const [viewMode, setViewMode] = usePersistedState('blocked-muted:display', VIEW_BLOCKED);
  const [loading, setLoading] = React.useState(!blockedUris || !blockedUris.length);

  // Keep a local list to allow for undoing actions in this component
  const [localBlockedList, setLocalBlockedList] = React.useState(undefined);
  const [localMutedList, setLocalMutedList] = React.useState(undefined);

  const previousFetchingModBlockList = usePrevious(fetchingModerationBlockList);
  const hasLocalMuteList = localMutedList && localMutedList.length > 0;
  const hasLocalBlockList = localBlockedList && localBlockedList.length > 0;
  const stringifiedMutedChannels = JSON.stringify(mutedUris);
  const justMuted = localMutedList && mutedUris && localMutedList.length < mutedUris.length;
  const justBlocked = localBlockedList && blockedUris && localBlockedList.length < blockedUris.length;
  const stringifiedBlockedChannels = JSON.stringify(blockedUris);

  React.useEffect(() => {
    if (previousFetchingModBlockList && !fetchingModerationBlockList) {
      setLoading(false);
    }
  }, [setLoading, previousFetchingModBlockList, fetchingModerationBlockList]);

  React.useEffect(() => {
    const jsonMutedChannels = stringifiedMutedChannels && JSON.parse(stringifiedMutedChannels);
    if (!hasLocalMuteList && jsonMutedChannels && jsonMutedChannels.length > 0) {
      setLocalMutedList(jsonMutedChannels);
    }
  }, [stringifiedMutedChannels, hasLocalMuteList]);

  React.useEffect(() => {
    const jsonBlockedChannels = stringifiedBlockedChannels && JSON.parse(stringifiedBlockedChannels);
    if (!hasLocalBlockList && jsonBlockedChannels && jsonBlockedChannels.length > 0) {
      setLocalBlockedList(jsonBlockedChannels);
    }
  }, [stringifiedBlockedChannels, hasLocalBlockList]);

  React.useEffect(() => {
    if (justMuted && stringifiedMutedChannels) {
      setLocalMutedList(JSON.parse(stringifiedMutedChannels));
    }
  }, [stringifiedMutedChannels, justMuted, setLocalMutedList]);

  React.useEffect(() => {
    if (justBlocked && stringifiedBlockedChannels) {
      setLocalBlockedList(JSON.parse(stringifiedBlockedChannels));
    }
  }, [stringifiedBlockedChannels, justBlocked, setLocalBlockedList]);

  return (
    <Page>
      {loading && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}

      {!loading && (
        <>
          <div className="section__header--actions">
            <div className="section__actions--inline">
              <Button
                icon={ICONS.BLOCK}
                button="alt"
                label={__('Blocked')}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': viewMode === VIEW_BLOCKED,
                })}
                onClick={() => setViewMode(VIEW_BLOCKED)}
              />
              <Button
                icon={ICONS.MUTE}
                button="alt"
                label={__('Muted')}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': viewMode === VIEW_MUTED,
                })}
                onClick={() => setViewMode(VIEW_MUTED)}
              />
            </div>
          </div>
          {
            <ClaimList
              uris={viewMode === VIEW_MUTED ? localMutedList : localBlockedList}
              showUnresolvedClaims
              showHiddenByUser
              hideMenu
              renderActions={(claim) => {
                return (
                  <div className="section__actions">
                    <ChannelBlockButton uri={claim.permanent_url} />
                    <ChannelMuteButton uri={claim.permanent_url} />
                  </div>
                );
              }}
            />
          }
        </>
      )}
    </Page>
  );
}

export default ListBlocked;
