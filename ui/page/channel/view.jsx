// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import { parseURI } from 'lbry-redux';
import { Lbryio } from 'lbryinc';
import Page from 'component/page';
import SubscribeButton from 'component/subscribeButton';
import BlockButton from 'component/blockButton';
import ShareButton from 'component/shareButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { withRouter } from 'react-router';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import ChannelContent from 'component/channelContent';
import ChannelAbout from 'component/channelAbout';
import ChannelDiscussion from 'component/channelDiscussion';
import ChannelThumbnail from 'component/channelThumbnail';
import ChannelEdit from 'component/channelEdit';
import ClaimUri from 'component/claimUri';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import HelpLink from 'component/common/help-link';
import DateTime from 'component/dateTime';
import ClaimSupportButton from 'component/claimSupportButton';

const PAGE_VIEW_QUERY = `view`;
const ABOUT_PAGE = `about`;
const DISCUSSION_PAGE = `discussion`;

type Props = {
  uri: string,
  claim: ChannelClaim,
  title: ?string,
  cover: ?string,
  thumbnail: ?string,
  page: number,
  location: { search: string },
  history: { push: string => void },
  match: { params: { attribute: ?string } },
  channelIsMine: boolean,
  isSubscribed: boolean,
  channelIsBlocked: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  fetchSubCount: string => void,
  subCount: number,
  pending: boolean,
};

function ChannelPage(props: Props) {
  const {
    uri,
    title,
    cover,
    history,
    location,
    page,
    channelIsMine,
    thumbnail,
    claim,
    isSubscribed,
    channelIsBlocked,
    blackListedOutpoints,
    fetchSubCount,
    subCount,
    pending,
  } = props;

  const { channelName } = parseURI(uri);
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;
  const [coverError, setCoverError] = useState(false);
  const { permanent_url: permanentUrl } = claim;
  const [editing, setEditing] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(thumbnail);
  const [coverPreview, setCoverPreview] = useState(cover);
  const [lastYtSyncDate, setLastYtSyncDate] = useState();
  const claimId = claim.claim_id;
  const formattedSubCount = Number(subCount).toLocaleString();

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.
  const tabIndex = currentView === ABOUT_PAGE || editing ? 1 : currentView === DISCUSSION_PAGE ? 2 : 0;

  function onTabChange(newTabIndex) {
    let url = formatLbryUrlForWeb(uri);
    let search = '?';

    if (newTabIndex === 0) {
      search += `page=${page}`;
    } else if (newTabIndex === 1) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    } else {
      search += `${PAGE_VIEW_QUERY}=${DISCUSSION_PAGE}`;
    }
    history.push(`${url}${search}`);
  }

  function doneEditing() {
    setEditing(false);
    setThumbPreview(thumbnail);
    setCoverPreview(cover);
  }

  useEffect(() => {
    Lbryio.call('yt', 'get_youtuber', { channel_claim_id: claimId }).then(response => {
      if (response.is_verified_youtuber) {
        setLastYtSyncDate(response.last_synced);
      } else {
        setLastYtSyncDate(undefined);
      }
    });
  }, [claimId]);

  let channelIsBlackListed = false;

  if (claim && blackListedOutpoints) {
    channelIsBlackListed = blackListedOutpoints.some(
      outpoint => outpoint.txid === claim.txid && outpoint.nout === claim.nout
    );
  }

  React.useEffect(() => {
    fetchSubCount(claimId);
  }, [uri, fetchSubCount, claimId]);

  React.useEffect(() => {
    if (!channelIsMine && editing) {
      setEditing(false);
    }
  }, [channelIsMine, editing]);

  return (
    <Page noFooter>
      <ClaimUri uri={uri} />

      {lastYtSyncDate && (
        <div className="media__uri--right">
          <Icon icon={ICONS.VALIDATED} size={12} />
          {__('Official YouTube Creator - Last updated %time_ago%', {
            time_ago: DateTime.getTimeAgoStr(lastYtSyncDate),
          })}
        </div>
      )}
      <header className="channel-cover">
        <div className="channel__quick-actions">
          {!channelIsBlocked && !channelIsBlackListed && <ShareButton uri={uri} />}
          {!channelIsBlocked && <ClaimSupportButton uri={uri} />}
          {!channelIsBlocked && (!channelIsBlackListed || isSubscribed) && <SubscribeButton uri={permanentUrl} />}
          {!isSubscribed && <BlockButton uri={permanentUrl} />}
        </div>
        {!editing && cover && !coverError && (
          <img
            className={classnames('channel-cover__custom', { 'channel__image--blurred': channelIsBlocked })}
            src={cover}
            onError={() => setCoverError(true)}
          />
        )}
        {editing && <img className="channel-cover__custom" src={coverPreview} />}
        {/* component that offers select/upload */}
        <div className="channel__primary-info">
          {!editing && (
            <ChannelThumbnail
              className="channel__thumbnail--channel-page"
              uri={uri}
              obscure={channelIsBlocked}
              allowGifs
            />
          )}
          {editing && (
            <ChannelThumbnail
              className="channel__thumbnail--channel-page"
              uri={uri}
              thumbnailPreview={thumbPreview}
              allowGifs
            />
          )}
          <h1 className="channel__title">{title || '@' + channelName}</h1>
          <div className="channel__meta">
            <span>
              {formattedSubCount} {subCount !== 1 ? __('Followers') : __('Follower')}
              <HelpLink href="https://lbry.com/faq/views" />
            </span>
            {channelIsMine && !editing && (
              <>
                {pending ? (
                  <span>{__('Your changes will be live in a few minutes')}</span>
                ) : (
                  <Button
                    button="alt"
                    title={__('Edit')}
                    onClick={() => setEditing(!editing)}
                    icon={ICONS.EDIT}
                    iconSize={18}
                    disabled={pending}
                  />
                )}
              </>
            )}
            {channelIsMine && editing && (
              <Button
                button="alt"
                title={__('Cancel')}
                onClick={() => doneEditing()}
                icon={ICONS.REMOVE}
                iconSize={18}
              />
            )}
          </div>
        </div>
        <div className="channel-cover__gradient" />
      </header>
      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--channel-page">
          <Tab disabled={editing}>{__('Content')}</Tab>
          <Tab>{editing ? __('Editing Your Channel') : __('About')}</Tab>
          <Tab disabled={editing}>{__('Comments')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ChannelContent uri={uri} channelIsBlackListed={channelIsBlackListed} />
          </TabPanel>
          <TabPanel>
            {editing ? (
              <ChannelEdit
                uri={uri}
                doneEditing={doneEditing}
                updateThumb={v => setThumbPreview(v)}
                updateCover={v => setCoverPreview(v)}
              />
            ) : (
              <ChannelAbout uri={uri} />
            )}
          </TabPanel>
          <TabPanel>
            <ChannelDiscussion uri={uri} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  );
}

export default withRouter(ChannelPage);
