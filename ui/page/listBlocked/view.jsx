// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import ChannelBlockButton from 'component/channelBlockButton';
import ChannelMuteButton from 'component/channelMuteButton';
import Yrbl from 'component/yrbl';

type Props = {
  mutedUris: ?Array<string>,
  blockedUris: ?Array<string>,
  fetchingModerationBlockList: boolean,
  fetchModBlockedList: () => void,
};

const VIEW_BLOCKED = 'blocked';
const VIEW_MUTED = 'muted';

function ListBlocked(props: Props) {
  const { mutedUris, blockedUris, fetchingModerationBlockList, fetchModBlockedList } = props;
  const [viewMode, setViewMode] = usePersistedState('blocked-muted:display', VIEW_BLOCKED);

  // Keep a local list to allow for undoing actions in this component
  const [localBlockedList, setLocalBlockedList] = React.useState(undefined);
  const [localMutedList, setLocalMutedList] = React.useState(undefined);

  const hasLocalMuteList = localMutedList && localMutedList.length > 0;
  const hasLocalBlockList = localBlockedList && localBlockedList.length > 0;
  const stringifiedMutedChannels = JSON.stringify(mutedUris);
  const justMuted = localMutedList && mutedUris && localMutedList.length < mutedUris.length;
  const justBlocked = localBlockedList && blockedUris && localBlockedList.length < blockedUris.length;
  const stringifiedBlockedChannels = JSON.stringify(blockedUris);
  const showUris = (viewMode === VIEW_MUTED && hasLocalMuteList) || (viewMode === VIEW_BLOCKED && hasLocalBlockList);

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

  const mutedHelpText = __(
    'Muted channels will be invisible to you in the app. They will not know they are muted and can still interact with you and your content.'
  );
  const blockedHelpText = __(
    "Blocked channels will be invisible to you in the app. They will not be able to comment on your content, or reply to you comments left on other channels' content."
  );

  return (
    <Page>
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
            <div className="section__actions--inline">
              <Button icon={ICONS.REFRESH} button="alt" label={__('Refresh')} onClick={() => fetchModBlockedList()} />
            </div>
          </div>

          {showUris && <div className="help--notice">{viewMode === VIEW_MUTED ? mutedHelpText : blockedHelpText}</div>}

          {showUris ? (
            <ClaimList
              uris={viewMode === VIEW_MUTED ? localMutedList : localBlockedList}
              showUnresolvedClaims
              showHiddenByUser
              hideMenu
              renderActions={(claim) => {
                return (
                  <div className="section__actions">
                    {viewMode === VIEW_MUTED ? (
                      <>
                        <ChannelMuteButton uri={claim.permanent_url} />
                        <ChannelBlockButton uri={claim.permanent_url} />
                      </>
                    ) : (
                      <>
                        <ChannelBlockButton uri={claim.permanent_url} />
                        <ChannelMuteButton uri={claim.permanent_url} />
                      </>
                    )}
                  </div>
                );
              }}
            />
          ) : (
            <div className="main--empty">
              <Yrbl
                title={
                  viewMode === VIEW_MUTED
                    ? __('You do not have any muted channels')
                    : __('You do not have any blocked channels')
                }
                subtitle={viewMode === VIEW_MUTED ? mutedHelpText : blockedHelpText}
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
