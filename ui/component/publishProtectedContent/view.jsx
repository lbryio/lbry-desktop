// @flow
import React, { useEffect } from 'react';
import { FormField } from 'component/common/form';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import { PAYWALL } from 'constants/publish';
import classnames from 'classnames';

type Props = {
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
  getMembershipTiersForContentClaimId: (type: string) => void,
  claim: Claim,
  protectedMembershipIds: Array<number>,
  activeChannel: ChannelClaim,
  incognito: boolean,
  getExistingTiers: ({ channel_name: string, channel_id: string }) => Promise<CreatorMemberships>,
  myMembershipTiers: CreatorMemberships,
  myMembershipTiersWithExclusiveContentPerk: CreatorMemberships,
  myMembershipTiersWithExclusiveLivestreamPerk: CreatorMemberships,
  location: string,
  isStillEditing: boolean,
  paywall: Paywall,
};

function PublishProtectedContent(props: Props) {
  const {
    activeChannel,
    incognito,
    updatePublishForm,
    getMembershipTiersForContentClaimId,
    claim,
    protectedMembershipIds,
    getExistingTiers,
    myMembershipTiers,
    myMembershipTiersWithExclusiveContentPerk,
    myMembershipTiersWithExclusiveLivestreamPerk,
    location,
    isStillEditing,
    paywall,
  } = props;

  const [isRestrictingContent, setIsRestrictingContent] = React.useState(false);

  const claimId = claim?.claim_id;

  let membershipsToUse = myMembershipTiersWithExclusiveContentPerk;
  if (location === 'livestream') membershipsToUse = myMembershipTiersWithExclusiveLivestreamPerk;

  const membershipsToUseIds =
    membershipsToUse && membershipsToUse.map((membershipTier) => membershipTier?.Membership?.id);

  // run the redux action
  React.useEffect(() => {
    if (claimId) {
      getMembershipTiersForContentClaimId(claimId);
    }
  }, [claimId]);

  // $FlowIssue
  const commaSeparatedValues = (isStillEditing && protectedMembershipIds?.join(',')) || '';

  // if there are already restricted memberships for this content, setup state
  React.useEffect(() => {
    if (!activeChannel) return;
    // we check isStillEditing because otherwise the restriction values will load when a claim matches
    if (protectedMembershipIds && protectedMembershipIds.length && isStillEditing) {
      setIsRestrictingContent(true);
      const restrictionCheckbox = document.getElementById('toggleRestrictedContent');
      // $FlowFixMe
      if (restrictionCheckbox) restrictionCheckbox.checked = true;

      updatePublishForm({
        restrictedToMemberships: commaSeparatedValues,
        channelClaimId: activeChannel.claim_id,
      });
    } else {
      // $FlowFixMe
      const restrictionCheckbox: HTMLInputElement = document.getElementById('toggleRestrictedContent');
      // clear out data unless user has already checked that they are restricting
      if (restrictionCheckbox?.checked !== true) {
        updatePublishForm({
          restrictedToMemberships: commaSeparatedValues,
          channelClaimId: activeChannel.claim_id,
        });
      }
    }
  }, [protectedMembershipIds, activeChannel, isStillEditing]);

  function handleRestrictedMembershipChange(event) {
    let matchedMemberships;
    const restrictCheckboxes = document.querySelectorAll('*[id^="restrictToMembership"]');

    // $FlowFixMe
    for (const checkbox of restrictCheckboxes) {
      // $FlowFixMe
      if (checkbox.checked) {
        matchedMemberships = new Set(matchedMemberships);
        matchedMemberships.add(Number(checkbox.id.split(':')[1]));
      }
    }

    const commaSeparatedValueString = matchedMemberships && Array.from(matchedMemberships).join(',');

    updatePublishForm({
      restrictedToMemberships: commaSeparatedValueString,
      channelClaimId: activeChannel.claim_id,
    });
  }

  function handleChangeRestriction() {
    // update data to check against during publish
    // backend checks against an empty string so need to use that instead of undefined
    updatePublishForm({ restrictedToMemberships: isRestrictingContent ? '' : null });

    setIsRestrictingContent(!isRestrictingContent);
  }

  React.useEffect(() => {
    if (isRestrictingContent) {
      const elementsToHide = document.getElementsByClassName('hide-tier');

      if (elementsToHide) {
        for (const element of elementsToHide) {
          // $FlowFixMe
          element.parentElement.style.display = 'none';
        }
      }
    }
  }, [isRestrictingContent]);

  useEffect(() => {
    if (activeChannel) {
      getExistingTiers({
        channel_name: activeChannel.normalized_name,
        channel_id: activeChannel.claim_id,
      });
    }
  }, [activeChannel]);

  if (incognito) return null;

  if (!myMembershipTiers || (myMembershipTiers && myMembershipTiers.length === 0)) {
    return (
      <>
        <h2 className="card__title">{__('Restrict Content')}</h2>

        <Card
          className="card--restrictions"
          body={
            <I18nMessage
              tokens={{
                activate_your_memberships: (
                  <Button
                    navigate={`/$/${PAGES.CREATOR_MEMBERSHIPS}`}
                    label={__('activate your memberships')}
                    button="link"
                  />
                ),
              }}
            >
              Please %activate_your_memberships% first to to use this functionality.
            </I18nMessage>
          }
        />
      </>
    );
  }

  if (membershipsToUse && membershipsToUse.length > 0) {
    return (
      <>
        <h2 className="card__title">{__('Restrict Content')}</h2>

        <Card
          className="card--restrictions"
          body={
            <>
              <FormField
                type="checkbox"
                disabled={paywall !== PAYWALL.FREE}
                defaultChecked={isRestrictingContent}
                label={__('Restrict content to only allow subscribers to certain memberships to view it')}
                name={'toggleRestrictedContent'}
                className="restrict-content__checkbox"
                onChange={handleChangeRestriction}
              />

              {isRestrictingContent && (
                <div className="tier-list">
                  {myMembershipTiers.map((membership) => (
                    <FormField
                      disabled={paywall !== PAYWALL.FREE}
                      key={membership.Membership.id}
                      type="checkbox"
                      // $FlowIssue
                      defaultChecked={isStillEditing && protectedMembershipIds?.includes(membership.Membership.id)}
                      label={membership.Membership.name}
                      name={'restrictToMembership:' + membership.Membership.id}
                      onChange={handleRestrictedMembershipChange}
                      className={classnames({
                        'hide-tier': !membershipsToUseIds.includes(membership.Membership.id),
                      })}
                    />
                  ))}
                </div>
              )}

              {paywall !== PAYWALL.FREE && (
                <div className="error__text">
                  {__('This file has an attached price, disabled it in order to add content restrictions.')}
                </div>
              )}
            </>
          }
        />
      </>
    );
  }

  return null;
}

export default PublishProtectedContent;
