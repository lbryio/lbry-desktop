// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
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
import { Form, FormField } from 'component/common/form';
import Icon from 'component/common/icon';
import HelpLink from 'component/common/help-link';
import { DEBOUNCE_WAIT_DURATION_MS } from 'constants/search';
import ClaimList from 'component/claimList';
import DateTime from 'component/dateTime';

const PAGE_VIEW_QUERY = `view`;
const ABOUT_PAGE = `about`;
const DISCUSSION_PAGE = `discussion`;
const LIGHTHOUSE_URL = 'https://lighthouse.lbry.com/search';
const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;

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
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  supportOption: boolean,
  fetchSubCount: string => void,
  subCount: number,
  showMature: boolean,
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
    openModal,
    supportOption,
    showMature,
    fetchSubCount,
    subCount,
  } = props;

  const { channelName } = parseURI(uri);
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;
  const { permanent_url: permanentUrl } = claim;
  const [editing, setEditing] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(thumbnail);
  const [coverPreview, setCoverPreview] = useState(cover);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(undefined);
  const [lastYtSyncDate, setLastYtSyncDate] = useState();
  const claimId = claim.claim_id;

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.
  const tabIndex = currentView === ABOUT_PAGE || editing ? 1 : currentView === DISCUSSION_PAGE ? 2 : 0;

  function onTabChange(newTabIndex) {
    let url = formatLbryUrlForWeb(uri);
    let search = '?';

    if (newTabIndex === 0) {
      setSearchResults(null);
      search += `page=${page}`;
    } else if (newTabIndex === 1) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    } else {
      search += `${PAGE_VIEW_QUERY}=${DISCUSSION_PAGE}`;
    }
    history.push(`${url}${search}`);
  }

  function getResults(fetchUrl) {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(results => {
        const urls = results.map(({ name, claimId }) => {
          return `lbry://${name}#${claimId}`;
        });
        setSearchResults(urls);
      })
      .catch(() => {
        setSearchResults(null);
      });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === '') {
        // In order to display original search results, search results must be set to null. A query of '' should display original results.
        return setSearchResults(null);
      } else {
        getResults(
          `${LIGHTHOUSE_URL}?s=${encodeURIComponent(searchQuery)}&channel_id=${encodeURIComponent(claimId)}${
            !showMature ? '&nsfw=false' : ''
          }`
        );
      }
    }, DEBOUNCE_WAIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [claimId, searchQuery]);

  useEffect(() => {
    Lbryio.call('yt', 'get_youtuber', { channel_claim_id: claimId }).then(response => {
      if (response.is_verified_youtuber) {
        setLastYtSyncDate(response.last_synced);
      }
    });
  }, [claimId]);

  function handleInputChange(e) {
    const { value } = e.target;
    setSearchQuery(value);
  }

  /*
    Since the search is inside of TabList, the left and right arrow keys change the tabIndex.
    This results in the user not being able to navigate the search string by using arrow keys.
    This function allows the event to change cursor position and then stops propagation to prevent tab changing.
  */
  function handleSearchArrowKeys(e) {
    if (e.keyCode === ARROW_LEFT_KEYCODE || e.keyCode === ARROW_RIGHT_KEYCODE) {
      e.stopPropagation();
    }
  }

  let channelIsBlackListed = false;

  if (claim && blackListedOutpoints) {
    channelIsBlackListed = blackListedOutpoints.some(
      outpoint => outpoint.txid === claim.txid && outpoint.nout === claim.nout
    );
  }

  React.useEffect(() => {
    setSearchResults(null);
    setSearchQuery('');

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
          {!channelIsMine && (
            <Button
              button="alt"
              icon={ICONS.TIP}
              label={__('Tip')}
              title={__('Send a tip to this creator')}
              onClick={() => openModal(MODALS.SEND_TIP, { uri, channelIsMine, isSupport: false })}
            />
          )}
          {(channelIsMine || (!channelIsMine && supportOption)) && (
            <Button
              button="alt"
              icon={ICONS.SUPPORT}
              label={__('Support')}
              title={__('Support this creator')}
              onClick={() => openModal(MODALS.SEND_TIP, { uri, channelIsMine, isSupport: true })}
            />
          )}
          {!channelIsBlocked && (!channelIsBlackListed || isSubscribed) && <SubscribeButton uri={permanentUrl} />}
          {!isSubscribed && <BlockButton uri={permanentUrl} />}
        </div>
        {!editing && cover && (
          <img
            className={classnames('channel-cover__custom', { 'channel__image--blurred': channelIsBlocked })}
            src={cover}
          />
        )}
        {editing && <img className="channel-cover__custom" src={coverPreview} />}
        {/* component that offers select/upload */}
        <div className="channel__primary-info">
          {!editing && (
            <ChannelThumbnail className="channel__thumbnail--channel-page" uri={uri} obscure={channelIsBlocked} />
          )}
          {editing && (
            <ChannelThumbnail className="channel__thumbnail--channel-page" uri={uri} thumbnailPreview={thumbPreview} />
          )}
          <h1 className="channel__title">{title || '@' + channelName}</h1>
          <div className="channel__meta">
            <span>
              {subCount} {subCount !== 1 ? __('Followers') : __('Follower')}
              <HelpLink href="https://lbry.com/faq/views" />
            </span>
            {channelIsMine && !editing && (
              <Button
                button="alt"
                title={__('Edit')}
                onClick={() => setEditing(!editing)}
                icon={ICONS.EDIT}
                iconSize={18}
              />
            )}
          </div>
        </div>
      </header>
      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--channel-page">
          <Tab disabled={editing}>{__('Content')}</Tab>
          <Tab>{editing ? __('Editing Your Channel') : __('About')}</Tab>
          <Tab disabled={editing}>{__('Comments')}</Tab>
          {/* only render searchbar on content page (tab index 0 === content page) */}
          {tabIndex === 0 ? (
            <Form onSubmit={() => {}} className="wunderbar--inline">
              <Icon icon={ICONS.SEARCH} />
              <FormField
                className="wunderbar__input"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleSearchArrowKeys}
                type="text"
                placeholder={__('Search')}
              />
            </Form>
          ) : (
            <div />
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            {searchResults ? (
              <ClaimList
                header={false}
                headerAltControls={null}
                id={`search-results-for-${claimId}`}
                loading={false}
                showHiddenByUser={false}
                uris={searchResults}
              />
            ) : (
              <ChannelContent uri={uri} channelIsBlackListed={channelIsBlackListed} />
            )}
          </TabPanel>
          <TabPanel>
            {editing ? (
              <ChannelEdit
                uri={uri}
                setEditing={setEditing}
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
