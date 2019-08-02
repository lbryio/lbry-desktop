// @flow
import React, { useState } from 'react';
import { parseURI } from 'lbry-redux';
import Page from 'component/page';
import SubscribeButton from 'component/subscribeButton';
import BlockButton from 'component/blockButton';
import ShareButton from 'component/shareButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { withRouter } from 'react-router';
import Button from 'component/button';
import { formatLbryUriForWeb } from 'util/uri';
import ChannelContent from 'component/channelContent';
import ChannelAbout from 'component/channelAbout';
import ChannelThumbnail from 'component/channelThumbnail';
import ChannelEdit from 'component/channelEdit';
import ClaimUri from 'component/claimUri';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';

const PAGE_VIEW_QUERY = `view`;
const ABOUT_PAGE = `about`;

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
  } = props;
  const { channelName } = parseURI(uri);
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;
  const { permanent_url: permanentUrl } = claim;
  const [editing, setEditing] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(thumbnail);
  const [coverPreview, setCoverPreview] = useState(cover);

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.
  const tabIndex = currentView === ABOUT_PAGE || editing ? 1 : 0;
  const onTabChange = newTabIndex => {
    let url = formatLbryUriForWeb(uri);
    let search = '?';
    if (newTabIndex !== 0) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    } else {
      search += `page=${page}`;
    }

    history.push(`${url}${search}`);
  };

  return (
    <Page>
      <div className="card">
        <header className="channel-cover">
          {!editing && cover && (
            <img
              className={classnames('channel-cover__custom', { 'channel__image--blurred': channelIsBlocked })}
              src={cover}
            />
          )}
          {editing && <img className="channel-cover__custom" src={coverPreview} />}
          {/* component that offers select/upload */}
          <div className="channel__primary-info ">
            {!editing && (
              <ChannelThumbnail className="channel__thumbnail--channel-page" uri={uri} obscure={channelIsBlocked} />
            )}
            {editing && (
              <ChannelThumbnail
                className="channel__thumbnail--channel-page"
                uri={uri}
                thumbnailPreview={thumbPreview}
              />
            )}
            <h1 className="channel__title">
              {title || channelName}
              {channelIsMine && !editing && (
                <Button title={__('Edit')} onClick={() => setEditing(!editing)} icon={ICONS.EDIT} iconSize={49} />
              )}
            </h1>
            <h2 className="channel__url">
              <ClaimUri uri={uri} />
            </h2>
          </div>
        </header>
        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--channel-page">
            <Tab disabled={editing}>{__('Content')}</Tab>
            <Tab>{editing ? __('Editing Your Channel') : __('About')}</Tab>
            <div className="card__actions--inline">
              <ShareButton uri={uri} />
              {!channelIsBlocked && <SubscribeButton uri={permanentUrl} />}
              {!isSubscribed && <BlockButton uri={permanentUrl} />}
            </div>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ChannelContent uri={uri} />
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
          </TabPanels>
        </Tabs>
      </div>
    </Page>
  );
}

export default withRouter(ChannelPage);
