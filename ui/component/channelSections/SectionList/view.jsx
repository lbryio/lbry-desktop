// @flow
import React from 'react';
import classnames from 'classnames';

import './style.scss';
import Button from 'component/button';
import Section from 'component/channelSections/Section';
import Icon from 'component/common/icon';
import MembershipSplash from 'component/membershipSplash';
import Spinner from 'component/spinner';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';

type Props = {
  uri: string,
  editMode?: boolean,
  // --- redux ---
  claimId: ?string,
  creatorSettings: ?PerChannelSettings,
  featuredChannels: ?Array<FeaturedChannelsSection>,
  userHasOdyseeMembership: ?boolean,
  fetchingCreatorSettings: boolean,
  doFetchCreatorSettings: (channelId: string) => Promise<any>,
  doOpenModal: (id: string, props: {}) => void,
};

export default function SectionList(props: Props) {
  const {
    editMode,
    claimId,
    creatorSettings,
    featuredChannels,
    userHasOdyseeMembership,
    fetchingCreatorSettings,
    doFetchCreatorSettings,
    doOpenModal,
  } = props;

  const [isFetching, setIsFetching] = React.useState(false);

  const sectionCount = featuredChannels ? featuredChannels.length : 0;

  function openPromoModal() {
    doOpenModal(MODALS.CONFIRM, {
      title: __('Featured Channels'),
      subtitle: (
        <>
          <p className="section__subtitle">
            {__('Setting up Featured Channels is currently an early-access feature available with Odysee Premium.')}
          </p>
          <p className="section__subtitle">{__('Sign up now to configure on your own channel!')}</p>
        </>
      ),
      body: (
        <div className="card__main-actions">
          <MembershipSplash pageLocation={'confirmPage'} currencyToUse={'usd'} />
        </div>
      ),
      labelOk: __('Close'),
      onConfirm: (closeModal) => {
        closeModal();
      },
      hideCancel: true,
    });
  }

  function handleAddFeaturedChannels() {
    if (userHasOdyseeMembership) {
      doOpenModal(MODALS.FEATURED_CHANNELS_EDIT, { channelId: claimId });
    } else {
      openPromoModal();
    }
  }

  function handleSort() {
    doOpenModal(MODALS.FEATURED_CHANNELS_SORT, { channelId: claimId });
  }

  React.useEffect(() => {
    if (creatorSettings === undefined && claimId) {
      setIsFetching(true);
      doFetchCreatorSettings(claimId).finally(() => setIsFetching(false));
    }
  }, [claimId, creatorSettings, doFetchCreatorSettings]);

  return (
    <div className={classnames('channel_sections', { 'channel_sections--disabled': fetchingCreatorSettings })}>
      {editMode && (
        <div className="channel_sections__actions">
          {fetchingCreatorSettings && <Spinner type="small" />}
          <Button
            label={__('Add featured channels')}
            button="secondary"
            icon={ICONS.ADD}
            onClick={handleAddFeaturedChannels}
          />
          {sectionCount > 1 && (
            <Button title={__('Sort')} button="secondary" icon={ICONS.ARRANGE} onClick={handleSort} />
          )}
        </div>
      )}
      {!editMode && sectionCount > 0 && (
        <div className="channel_sections__actions">
          <Icon icon={ICONS.HELP} size={20} onClick={openPromoModal} />
        </div>
      )}
      <div className="channel_sections__list">
        {sectionCount === 0 && (
          <div className="empty main--empty">
            {isFetching && <Spinner />}
            {!isFetching && (
              <>
                {__('No featured channels.')}
                {!userHasOdyseeMembership && <Button button="link" label={__('Learn more')} onClick={openPromoModal} />}
              </>
            )}
          </div>
        )}
        {!isFetching &&
          featuredChannels &&
          featuredChannels.map((fc) => (
            <Section
              key={fc.id}
              id={fc.id}
              title={fc.value.title}
              uris={fc.value.uris}
              channelId={claimId}
              showAllItems={featuredChannels.length === 1}
            />
          ))}
      </div>
    </div>
  );
}
