// @flow
import React from 'react';
import './style.scss';

type Props = {
  membership: CreatorMembership,
  headerAction?: any,
  unlockableTierIds?: Array<number>,
  userHasACreatorMembership?: boolean,
  isChannelTab?: boolean,
  membersOnly?: boolean,
  isLivestream?: ?boolean,
};

const MembershipDetails = (props: Props) => {
  const {
    membership,
    headerAction,
    unlockableTierIds,
    userHasACreatorMembership,
    isChannelTab,
    membersOnly,
    isLivestream,
  } = props;

  const descriptionParagraphs = membership.Membership.description.split('\n');
  const selectedMembershipName = membership.Membership.name;
  const membershipIsUnlockable = !userHasACreatorMembership && new Set(unlockableTierIds).has(membership.Membership.id);

  let accessText = __(
    membersOnly
      ? !isLivestream
        ? 'This membership does not give you access to the members-only comment section.'
        : 'This membership does not give you access to the members-only chat mode.'
      : 'This Tier does not grant you access to the currently selected content.'
  );
  if (userHasACreatorMembership) {
    accessText = __("You can't upgrade or downgrade plans at the moment, coming soon!");
  } else if (membershipIsUnlockable) {
    // This is the green alert, only used to prevent the modal from moving when moving tiers from one that
    // has access to one that doesn't
    accessText = __(
      membersOnly
        ? !isLivestream
          ? 'This membership gives you access to the members-only comment section.'
          : 'This membership gives you access to the members-only chat mode.'
        : 'This membership gives you access to the current content.'
    );
  }

  return (
    <>
      {unlockableTierIds && (
        <div className={'access-status' + ' ' + (membershipIsUnlockable ? 'green' : 'red')}>
          <label>{accessText}</label>
        </div>
      )}

      {!isChannelTab && <div className="selected-membership">{selectedMembershipName}</div>}

      <section className="membership-tier__header">
        <span>{membership.Membership.name}</span>
      </section>

      <section className="membership-tier__infos">
        <span className="membership-tier__infos-description">
          {descriptionParagraphs.map((descriptionLine, i) =>
            descriptionLine === '' ? <br /> : <p key={i}>{descriptionLine}</p>
          )}
        </span>

        <div className="membership-tier__perks">
          <div className="membership-tier__moon" />
          <div className="membership-tier__perks-content">
            {membership.Perks && membership.Perks.length > 0 ? (
              <>
                <label>{__('Perks')}</label>
                <ul>
                  {/* $FlowFixMe -- already handled above */}
                  {membership.Perks.map((tierPerk, i) => (
                    <li key={i}>{__(tierPerk.name)}</li>
                  ))}
                </ul>
              </>
            ) : (
              <label>{__('No Perks...')}</label>
            )}
          </div>
        </div>
      </section>

      {headerAction && <section className="membership-tier__actions">{headerAction}</section>}
    </>
  );
};

export default MembershipDetails;
