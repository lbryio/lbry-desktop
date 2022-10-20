// @flow
import React from 'react';

import { useHistory } from 'react-router';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { lazyImport } from 'util/lazyImport';
import { formatLbryUrlForWeb } from 'util/url';

import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';

import Page from 'component/page';
import ChannelSelector from 'component/channelSelector';
import Button from 'component/button';
import TabWrapper from './internal/tabWrapper';

import './style.scss';

const OverviewTab = lazyImport(() => import('./internal/overviewTab' /* webpackChunkName: "overviewTab" */));
const TiersTab = lazyImport(() => import('./internal/tiersTab' /* webpackChunkName: "tiersTab" */));
const SupportersTab = lazyImport(() => import('./internal/supportersTab' /* webpackChunkName: "supportersTab" */));

const TAB_QUERY = 'tab';

const TABS = {
  OVERVIEW: 'overview',
  SUPPORTERS: 'supporters',
  TIERS: 'tiers',
};

type Props = {
  // -- redux --
  activeChannelClaim: ?ChannelClaim,
  myChannelClaims: ?Array<ChannelClaim>,
  supportersList: ?SupportersList,
  doListAllMyMembershipTiers: () => Promise<CreatorMemberships>,
  doGetMembershipSupportersList: () => void,
};

const CreatorArea = (props: Props) => {
  const {
    activeChannelClaim,
    myChannelClaims,
    supportersList,
    doListAllMyMembershipTiers,
    doGetMembershipSupportersList,
  } = props;

  const [allSelected, setAllSelected] = React.useState(true);

  const channelsToList = React.useMemo(() => {
    if (!myChannelClaims) return myChannelClaims;
    if (!activeChannelClaim) return activeChannelClaim;

    if (allSelected) return myChannelClaims;
    return [activeChannelClaim];
  }, [activeChannelClaim, allSelected, myChannelClaims]);

  React.useEffect(() => {
    if (myChannelClaims !== undefined) {
      doListAllMyMembershipTiers();
    }
  }, [doListAllMyMembershipTiers, myChannelClaims]);

  React.useEffect(() => {
    if (supportersList === undefined) {
      doGetMembershipSupportersList();
    }
  }, [doGetMembershipSupportersList, supportersList]);

  const {
    location: { search },
    push,
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  // if tiers are saved, then go to balance, otherwise go to tiers
  const currentView = urlParams.get(TAB_QUERY) || TABS.OVERVIEW;

  // based on query param or default, update value which will determine which tab to show
  let tabIndex = 0;
  switch (currentView) {
    case TABS.OVERVIEW:
      tabIndex = 0;
      break;
    case TABS.SUPPORTERS:
      tabIndex = 1;
      break;
    case TABS.TIERS:
      tabIndex = 2;
      break;
  }

  function onTabChange(newTabIndex) {
    let url = `/$/${PAGES.CREATOR_MEMBERSHIPS}?`;

    if (newTabIndex === 0) {
      url += `${TAB_QUERY}=${TABS.OVERVIEW}`;
    } else if (newTabIndex === 1) {
      url += `${TAB_QUERY}=${TABS.SUPPORTERS}`;
    } else if (newTabIndex === 2) {
      url += `${TAB_QUERY}=${TABS.TIERS}`;
    }
    push(url);
  }

  const onChannelOverviewSelect = () => {
    setAllSelected(false);
    onTabChange(1);
  };

  const switchToTiersTab = () => onTabChange(2);

  return (
    <Page className="membershipPage-wrapper">
      <div className="membership__mychannels-header">
        <label>{__('Creator Portal')}</label>
      </div>

      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--collection-edit-page">
          <Tab>{__('Overview')}</Tab>
          <Tab>{__('My Supporters')}</Tab>
          <Tab>{__('My Tiers')}</Tab>
          <div className="no-after">
            <Tab>
              <Button
                navigate={`/$/${PAGES.MEMBERSHIPS_LANDING}`}
                label={__('Back To Memberships')}
                icon={ICONS.BACK}
                button="secondary"
              />
            </Tab>
          </div>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TabWrapper
              switchToTiersTab={switchToTiersTab}
              component={<OverviewTab onChannelSelect={onChannelOverviewSelect} />}
            />
          </TabPanel>

          <TabPanel>
            <TabWrapper
              switchToTiersTab={switchToTiersTab}
              component={
                <>
                  <span className="section__subtitle ">{__('Choose what channel to list supporters for')}</span>
                  <ChannelSelector
                    hideAnon
                    allOptionProps={{ onSelectAll: () => setAllSelected(true), isSelected: allSelected }}
                    onChannelSelect={() => setAllSelected(false)}
                  />
                  <SupportersTab channelsToList={channelsToList} switchToTiersTab={switchToTiersTab} />
                </>
              }
            />
          </TabPanel>

          <TabPanel>
            <TabWrapper
              component={
                <>
                  <div className="create-tiers-header-buttons">
                    <div className="create-tiers-channel-selector">
                      <span className="section__subtitle ">{__('Choose what channel to manage tiers for')}</span>
                      <ChannelSelector hideAnon onChannelSelect={() => setAllSelected(false)} />
                    </div>

                    <div className="create-tiers-preview-button">
                      <span className="section__subtitle ">{__('Preview your tiers')}</span>
                      <br />
                      <Button
                        navigate={`${formatLbryUrlForWeb(activeChannelClaim?.canonical_url)}?view=membership`}
                        label={__('See Your Memberships')}
                        icon={ICONS.BACK}
                        button="secondary"
                      />
                    </div>
                  </div>

                  <TiersTab />
                </>
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  );
};

export default CreatorArea;
