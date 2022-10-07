// @flow
import React from 'react';
import classnames from 'classnames';
import { ChannelPageContext } from 'page/channel/view';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import ButtonNavigateChannelId from 'component/buttonNavigateChannelId';
import MembershipTier from './internal/membershipTier';
import MembershipDetails from './internal/membershipDetails';
import ChannelThumbnail from 'component/channelThumbnail';
import * as MODALS from 'constants/modal_types';

import './style.scss';

type Props = {
  uri: string,
  selectedTier: CreatorMembership,
  selectedMembershipIndex: number,
  unlockableTierIds: Array<number>,
  userHasACreatorMembership: boolean,
  membersOnly?: boolean,
  isLivestream: ?boolean,
  setMembershipIndex: (index: number) => void,
  handleSelect: () => void,
  // -- redux --
  channelId: string,
  canReceiveFiatTips: ?boolean,
  channelIsMine: boolean,
  creatorMemberships: CreatorMemberships,
  doTipAccountCheckForUri: (uri: string) => void,
  channelTitle: string,
  channelUri: string,
  channelName: string,
  doOpenModal: (id: string, props: {}) => void,
};

const PreviewPage = (props: Props) => {
  const {
    uri,
    selectedTier,
    selectedMembershipIndex,
    unlockableTierIds,
    userHasACreatorMembership,
    membersOnly,
    isLivestream,
    setMembershipIndex,
    handleSelect,
    // -- redux --
    channelId,
    canReceiveFiatTips,
    channelIsMine,
    creatorMemberships,
    doTipAccountCheckForUri,
    channelTitle,
    channelUri,
    channelName,
    doOpenModal,
  } = props;

  const isChannelTab = React.useContext(ChannelPageContext);

  const creatorHasMemberships = creatorMemberships && creatorMemberships.length > 0;
  const creatorPurchaseDisabled = channelIsMine || canReceiveFiatTips === false;

  React.useEffect(() => {
    if (canReceiveFiatTips === undefined) {
      doTipAccountCheckForUri(uri);
    }
  }, [canReceiveFiatTips, doTipAccountCheckForUri, uri]);

  if (!creatorHasMemberships) {
    // -- On a channel that is mine, the button uses the channel id to set it as active
    // when landing on the memberships page for the given channel --
    if (channelIsMine) {
      return (
        <div className="join-membership__empty">
          <h2 className="header--no-memberships">{__('Channel Has No Memberships')}</h2>
          <p>
            {__(
              "Unfortunately you haven't activated your memberships functionality for this channel yet, but you can do so now at the link below."
            )}
          </p>
          <div>
            <ButtonNavigateChannelId
              icon={ICONS.MEMBERSHIP}
              button="primary"
              type="submit"
              label={__('Create Memberships For %channel_name%', { channel_name: channelName })}
              navigate={`/$/${PAGES.CREATOR_MEMBERSHIPS}?tab=tiers`}
              channelId={channelId}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="join-membership__empty">
        <h2 className="header--no-memberships">{__('Channel Has No Memberships')}</h2>
        <h2>
          {__(
            "Unfortunately, this creator hasn't activated their membership functionality yet, but you can create your own tiers with the link below!"
          )}
        </h2>
        <div>
          <Button
            icon={ICONS.MEMBERSHIP}
            button="primary"
            type="submit"
            label={__('Create Your Memberships')}
            navigate={`/$/${PAGES.CREATOR_MEMBERSHIPS}?tab=tiers`}
          />
        </div>
      </div>
    );
  }

  if (isChannelTab) {
    return (
      <>
        {channelIsMine && (
          <div className="button--manage-memberships">
            <ButtonNavigateChannelId
              icon={ICONS.MEMBERSHIP}
              button="primary"
              type="submit"
              label={__('Manage Your Membership Tiers')}
              navigate={`/$/${PAGES.CREATOR_MEMBERSHIPS}?tab=tiers`}
              channelId={channelId}
            />
          </div>
        )}

        <div className="join-membership__tab">
          {creatorMemberships.map((membership, index) => (
            <MembershipTier
              membership={membership}
              handleSelect={() => {
                setMembershipIndex(index);
                doOpenModal(MODALS.JOIN_MEMBERSHIP, { uri, membershipIndex: index, passedTier: membership });
              }}
              index={index}
              length={creatorMemberships.length}
              key={index}
              disabled={creatorPurchaseDisabled}
              isChannelTab
            />
          ))}
        </div>
      </>
    );
  }

  function pickIconToUse(membershipId) {
    let icon = '';
    if (unlockableTierIds && !unlockableTierIds.includes(membershipId)) {
      icon = ICONS.LOCK;
    } else if (unlockableTierIds && unlockableTierIds.includes(membershipId)) {
      icon = ICONS.UNLOCK;
    }
    return icon;
  }

  return (
    <>
      <div className="join-membership__modal-header">
        <ChannelThumbnail uri={channelUri} />
        <h2>{channelTitle}</h2>
        <h3>{__('Join Membership')}</h3>
        <p>
          {__(
            'Support %channel_title% with a monthly membership subscription to help and receive exclusive features.',
            { channel_title: channelTitle }
          )}
        </p>
      </div>

      <div className="join-membership__modal-tabs">
        {creatorMemberships.map(({ Membership }, index) => (
          <Button
            key={Membership.id}
            label={Membership.name}
            button="alt"
            icon={pickIconToUse(Membership.id)}
            onClick={() => setMembershipIndex(index)}
            className={classnames('button-toggle', {
              'button-toggle--active': index === selectedMembershipIndex,
              'no-access-button': unlockableTierIds && !unlockableTierIds.includes(Membership.id),
              'access-button': unlockableTierIds && unlockableTierIds.includes(Membership.id),
            })}
          />
        ))}
      </div>

      <div className="join-membership__modal-content">
        <MembershipDetails
          membership={selectedTier}
          unlockableTierIds={unlockableTierIds}
          userHasACreatorMembership={userHasACreatorMembership}
          membersOnly={membersOnly}
          isLivestream={isLivestream}
        />
      </div>

      <div className="join-membership__modal-action">
        <Button
          icon={ICONS.MEMBERSHIP}
          button="primary"
          type="submit"
          disabled={userHasACreatorMembership || creatorPurchaseDisabled}
          label={__('Join for $%membership_price% per month', {
            membership_price: selectedTier?.NewPrices[0]?.creator_receives_amount / 100,
          })}
          requiresAuth
          onClick={handleSelect}
        />

        {creatorPurchaseDisabled && (
          <span className="error-bubble">
            {channelIsMine
              ? __("You're not able to signup for your own memberships")
              : __('This creator does not have an active bank account to receive payments.')}
          </span>
        )}
      </div>
    </>
  );
};

export default PreviewPage;
