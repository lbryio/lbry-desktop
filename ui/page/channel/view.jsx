// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { parseURI } from 'lbry-redux';
import { YOUTUBE_STATUSES } from 'lbryinc';
import Page from 'component/page';
import SubscribeButton from 'component/subscribeButton';
import ShareButton from 'component/shareButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { useHistory } from 'react-router';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import ChannelContent from 'component/channelContent';
import ChannelAbout from 'component/channelAbout';
import ChannelDiscussion from 'component/channelDiscussion';
import ChannelThumbnail from 'component/channelThumbnail';
import ChannelEdit from 'component/channelEdit';
import classnames from 'classnames';
import HelpLink from 'component/common/help-link';
import ClaimSupportButton from 'component/claimSupportButton';
import ChannelStakedIndicator from 'component/channelStakedIndicator';
import ClaimMenuList from 'component/claimMenuList';
import Yrbl from 'component/yrbl';

export const PAGE_VIEW_QUERY = `view`;
const CONTENT_PAGE = 'content';
const LISTS_PAGE = 'lists';
const ABOUT_PAGE = `about`;
export const DISCUSSION_PAGE = `discussion`;
const EDIT_PAGE = 'edit';

type Props = {
  uri: string,
  claim: ChannelClaim,
  title: ?string,
  cover: ?string,
  thumbnail: ?string,
  page: number,
  match: { params: { attribute: ?string } },
  channelIsMine: boolean,
  isSubscribed: boolean,
  channelIsBlocked: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  fetchSubCount: (string) => void,
  subCount: number,
  pending: boolean,
  youtubeChannels: ?Array<{ channel_claim_id: string, sync_status: string, transfer_state: string }>,
  blockedChannels: Array<string>,
  mutedChannels: Array<string>,
};

function ChannelPage(props: Props) {
  const {
    uri,
    claim,
    title,
    cover,
    // page, ?page= may come back some day?
    channelIsMine,
    isSubscribed,
    blackListedOutpoints,
    fetchSubCount,
    subCount,
    pending,
    youtubeChannels,
    blockedChannels,
    mutedChannels,
  } = props;
  const {
    push,
    goBack,
    location: { search },
  } = useHistory();
  const [viewBlockedChannel, setViewBlockedChannel] = React.useState(false);
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;
  const [discussionWasMounted, setDiscussionWasMounted] = React.useState(false);
  const editing = urlParams.get(PAGE_VIEW_QUERY) === EDIT_PAGE;
  const { channelName } = parseURI(uri);
  const { permanent_url: permanentUrl } = claim;
  const claimId = claim.claim_id;
  const formattedSubCount = Number(subCount).toLocaleString();
  const isBlocked = claim && blockedChannels.includes(claim.permanent_url);
  const isMuted = claim && mutedChannels.includes(claim.permanent_url);
  const isMyYouTubeChannel =
    claim &&
    youtubeChannels &&
    youtubeChannels.some(({ channel_claim_id, sync_status, transfer_state }) => {
      if (
        channel_claim_id === claim.claim_id &&
        sync_status !== YOUTUBE_STATUSES.YOUTUBE_SYNC_ABANDONDED &&
        transfer_state !== YOUTUBE_STATUSES.YOUTUBE_SYNC_COMPLETED_TRANSFER
      ) {
        return true;
      }
    });
  let channelIsBlackListed = false;

  if (claim && blackListedOutpoints) {
    channelIsBlackListed = blackListedOutpoints.some(
      (outpoint) => outpoint.txid === claim.txid && outpoint.nout === claim.nout
    );
  }

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.
  let tabIndex;
  switch (currentView) {
    case CONTENT_PAGE:
      tabIndex = 0;
      break;
    case LISTS_PAGE:
      tabIndex = 1;
      break;
    case ABOUT_PAGE:
      tabIndex = 2;
      break;
    case DISCUSSION_PAGE:
      tabIndex = 3;
      break;
    default:
      tabIndex = 0;
      break;
  }

  function onTabChange(newTabIndex) {
    let url = formatLbryUrlForWeb(uri);
    let search = '?';

    if (newTabIndex === 0) {
      search += `${PAGE_VIEW_QUERY}=${CONTENT_PAGE}`;
    } else if (newTabIndex === 1) {
      search += `${PAGE_VIEW_QUERY}=${LISTS_PAGE}`;
    } else if (newTabIndex === 2) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    } else {
      search += `${PAGE_VIEW_QUERY}=${DISCUSSION_PAGE}`;
    }

    push(`${url}${search}`);
  }

  React.useEffect(() => {
    if (currentView === DISCUSSION_PAGE) {
      setDiscussionWasMounted(true);
    }
  }, [currentView]);

  React.useEffect(() => {
    fetchSubCount(claimId);
  }, [uri, fetchSubCount, claimId]);

  if (editing) {
    return (
      <Page
        noFooter
        noSideNavigation={editing}
        backout={{
          title: __('Editing @%channel%', { channel: channelName }),
          simpleTitle: __('Editing'),
        }}
      >
        <ChannelEdit uri={uri} onDone={() => goBack()} />
      </Page>
    );
  }

  return (
    <Page noFooter>
      <header className="channel-cover">
        <div className="channel__quick-actions">
          {isMyYouTubeChannel && (
            <Button
              button="alt"
              label={__('Claim Your Channel')}
              icon={ICONS.YOUTUBE}
              navigate={`/$/${PAGES.CHANNELS}`}
            />
          )}
          {!channelIsBlackListed && <ShareButton uri={uri} />}
          {!(isBlocked || isMuted) && <ClaimSupportButton uri={uri} />}
          {!(isBlocked || isMuted) && (!channelIsBlackListed || isSubscribed) && <SubscribeButton uri={permanentUrl} />}
          {/* TODO: add channel collections <ClaimCollectionAddButton uri={uri} fileAction /> */}
          <ClaimMenuList uri={claim.permanent_url} inline />
        </div>
        {cover && <img className={classnames('channel-cover__custom')} src={cover} />}
        <div className="channel__primary-info">
          <ChannelThumbnail
            className="channel__thumbnail--channel-page"
            uri={uri}
            allowGifs
            hideStakedIndicator
            noOptimization
          />
          <h1 className="channel__title">
            {title || '@' + channelName}
            <ChannelStakedIndicator uri={uri} large />
          </h1>
          <div className="channel__meta">
            <span>
              {formattedSubCount} {subCount !== 1 ? __('Followers') : __('Follower')}
              <HelpLink href="https://lbry.com/faq/views" />
            </span>
            {channelIsMine && (
              <>
                {pending ? (
                  <span>{__('Your changes will be live in a few minutes')}</span>
                ) : (
                  <Button
                    button="alt"
                    title={__('Edit')}
                    onClick={() => push(`?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`)}
                    icon={ICONS.EDIT}
                    iconSize={18}
                    disabled={pending}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="channel-cover__gradient" />
      </header>

      {(isBlocked || isMuted) && !viewBlockedChannel ? (
        <div className="main--empty">
          <Yrbl
            title={isBlocked ? __('This channel is blocked') : __('This channel is muted')}
            subtitle={
              isBlocked
                ? __('Are you sure you want to view this content? Viewing will not unblock @%channel%', {
                    channel: channelName,
                  })
                : __('Are you sure you want to view this content? Viewing will not unmute @%channel%', {
                    channel: channelName,
                  })
            }
            actions={
              <div className="section__actions">
                <Button button="primary" label={__('View Content')} onClick={() => setViewBlockedChannel(true)} />
              </div>
            }
          />
        </div>
      ) : (
        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--channel-page">
            <Tab disabled={editing}>{__('Publishes')}</Tab>
            <Tab disabled={editing}>{__('Playlists')}</Tab>
            <Tab>{editing ? __('Editing Your Channel') : __('About --[tab title in Channel Page]--')}</Tab>
            <Tab disabled={editing}>{__('Community')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ChannelContent
                claimType={'stream'}
                uri={uri}
                channelIsBlackListed={channelIsBlackListed}
                viewHiddenChannels
              />
            </TabPanel>
            <TabPanel>
              <ChannelContent
                claimType={'collection'}
                uri={uri}
                channelIsBlackListed={channelIsBlackListed}
                viewHiddenChannels
              />
            </TabPanel>
            <TabPanel>
              <ChannelAbout uri={uri} />
            </TabPanel>
            <TabPanel>
              {(discussionWasMounted || currentView === DISCUSSION_PAGE) && <ChannelDiscussion uri={uri} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Page>
  );
}

export default ChannelPage;
