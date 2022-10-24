// @flow
import React from 'react';

import { FormField } from 'component/common/form';
import { useIsMobile } from 'effects/use-screensize';

import * as MEMBERSHIP_CONSTS from 'constants/memberships';

import Button from 'component/button';
import BusyIndicator from 'component/common/busy-indicator';

const getIsInputEmpty = (value) => !value || value.length <= 2 || !/\S/.test(value);

const MIN_PRICE = '4';
const MAX_PRICE = '1000';

type Props = {
  membership: CreatorMembership,
  hasSubscribers: ?boolean,
  removeEditing: () => void,
  onCancel: () => void,
  // -- redux --
  membershipOdyseePerks: MembershipOdyseePerks,
  activeChannelClaim: ChannelClaim,
  doMembershipAddTier: (params: MembershipAddTierParams) => Promise<MembershipDetails>,
  addChannelMembership: (membership: any) => Promise<CreatorMemberships>,
  doMembershipList: (params: MembershipListParams, forceUpdate: ?boolean) => Promise<CreatorMemberships>,
};

function MembershipTier(props: Props) {
  const {
    membership,
    hasSubscribers,
    removeEditing,
    onCancel,
    // -- redux --
    membershipOdyseePerks,
    activeChannelClaim,
    doMembershipAddTier,
    addChannelMembership,
    doMembershipList,
  } = props;

  const isMobile = useIsMobile();
  const roughHeaderHeight = (isMobile ? 56 : 60) + 10; // @see: --header-height

  const nameRef = React.useRef();
  const contributionRef = React.useRef();

  const initialState = React.useRef({
    name: membership.Membership.name || '',
    description: membership.Membership.description || '',
    price: membership.NewPrices[0].creator_receives_amount / 100,
    perks: Array.from(new Set([...MEMBERSHIP_CONSTS.PERMANENT_TIER_PERKS, ...membership.Perks.map((perk) => perk.id)])),
  });

  const [editTierParams, setEditTierParams] = React.useState({
    editTierName: initialState.current.name,
    editTierDescription: initialState.current.description,
    editTierPrice: initialState.current.price,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPerkIds, setSelectedPerkIds] = React.useState(initialState.current.perks);

  const nameError = getIsInputEmpty(editTierParams.editTierName);
  const descriptionError = getIsInputEmpty(editTierParams.editTierDescription);

  const priceLowerThanMin = parseFloat(editTierParams.editTierPrice) < parseFloat(MIN_PRICE);
  const priceHigherThanMax = parseFloat(editTierParams.editTierPrice) > parseFloat(MAX_PRICE);
  const priceError = !editTierParams.editTierPrice || priceLowerThanMin || priceHigherThanMax;

  /**
   * When someone hits the 'Save' button from the edit functionality
   * @param membership - If an existing tier, use the old price and id
   * @returns {Promise<void>}
   */
  async function saveMembership() {
    const initialObj = initialState.current;
    const newObj = {
      name: editTierParams.editTierName,
      description: editTierParams.editTierDescription,
      price: editTierParams.editTierPrice,
      perks: selectedPerkIds,
    };

    const membershipObjDidNotChange = JSON.stringify(initialObj) === JSON.stringify(newObj);

    if (membershipObjDidNotChange) {
      // Simply "exit" here since there are no changes to save
      return removeEditing();
    }

    setIsSubmitting(true);

    const newTierMonthlyContribution = contributionRef.current?.input?.current?.value || 0;

    const selectedPerksAsArray = selectedPerkIds.toString();

    if (activeChannelClaim) {
      const isCreatingAMembership = typeof membership.Membership.id === 'string';
      const price = Number(newTierMonthlyContribution) * 100; // multiply to turn into cents

      doMembershipAddTier({
        channel_name: activeChannelClaim.name,
        channel_id: activeChannelClaim.claim_id,
        name: editTierParams.editTierName,
        description: editTierParams.editTierDescription,
        amount: price,
        currency: 'usd', // hardcoded for now
        perks: selectedPerksAsArray,
        old_stripe_price: membership.Prices ? membership.Prices[0].id : undefined,
        membership_id: isCreatingAMembership ? undefined : membership.Membership.id,
      })
        .then((response: MembershipDetails) => {
          setIsSubmitting(false);
          removeEditing();

          const selectedPerks = membershipOdyseePerks.filter((perk) => selectedPerkIds.includes(perk.id));

          const newMembershipObj = {
            HasSubscribers: false,
            Membership: response,
            NewPrices: [{ creator_receives_amount: price }],
            Perks: selectedPerks,
          };

          addChannelMembership(newMembershipObj);
          // force update for list
          doMembershipList({ channel_name: activeChannelClaim.name, channel_id: activeChannelClaim.claim_id }, true);
        })
        .catch(() => setIsSubmitting(false));
    }
  }

  const editTierWrapperRef = React.useCallback(
    (node) => {
      if (node) {
        const y = node.getBoundingClientRect().top + window.pageYOffset - roughHeaderHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    [roughHeaderHeight]
  );

  return (
    <div className="membership-tier__wrapper-edit" ref={editTierWrapperRef}>
      <FormField
        ref={nameRef}
        max="30"
        type="text"
        name="tier_name"
        label={__('Tier Name')}
        placeholder={membership.Membership.name}
        autoFocus
        onChange={(e) =>
          setEditTierParams((prev) => ({ ...prev, editTierName: nameRef.current?.input?.current?.value || '' }))
        }
        value={editTierParams.editTierName}
      />

      <FormField
        type="textarea"
        max="400"
        lines="3"
        name="tier_description"
        label={__('Tier Description')}
        placeholder={__('Description of your tier')}
        value={editTierParams.editTierDescription}
        onChange={(e) => setEditTierParams((prev) => ({ ...prev, editTierDescription: e.target.value }))}
      />

      <fieldset-section>
        <label htmlFor="tier_name">{__('Odysee Perks')}</label>
      </fieldset-section>

      {membershipOdyseePerks.map((tierPerk) => {
        const isPermanent = MEMBERSHIP_CONSTS.PERMANENT_TIER_PERKS.includes(tierPerk.id);
        const isSelected = new Set(selectedPerkIds).has(tierPerk.id);

        return (
          <FormField
            key={tierPerk.id}
            type="checkbox"
            defaultChecked={isPermanent || isSelected}
            label={__(tierPerk.description)}
            name={'perk_' + tierPerk.id + ' ' + 'membership_' + membership.Membership.id}
            className="membership_perks"
            disabled={isPermanent}
            onChange={() =>
              setSelectedPerkIds((prevPerks) => {
                const newPrevPerks = new Set(prevPerks);
                const isSelected = newPrevPerks.has(tierPerk.id);

                if (!isSelected) {
                  newPrevPerks.add(tierPerk.id);
                } else {
                  newPrevPerks.delete(tierPerk.id);
                }

                return Array.from(newPrevPerks);
              })
            }
          />
        );
      })}

      <FormField
        ref={contributionRef}
        className="form-field--price-amount"
        type="number"
        name="tier_contribution"
        step="1"
        min={MIN_PRICE}
        max={MAX_PRICE}
        label={__('Monthly Contribution ($/Month)')}
        value={editTierParams.editTierPrice}
        onChange={(e) => {
          const value = contributionRef.current?.input?.current?.value;
          setEditTierParams((prev) => ({ ...prev, editTierPrice: parseFloat(value) }));
        }}
        disabled={hasSubscribers}
      />

      <div className="section__actions">
        <Button
          disabled={nameError || descriptionError || priceError || isSubmitting}
          button="primary"
          label={isSubmitting ? <BusyIndicator message={__('Saving')} /> : __('Save Tier')}
          onClick={saveMembership}
        />
        <Button button="link" label={__('Cancel')} onClick={onCancel} />
      </div>
      <div className="section__actions">
        <p className="help">
          <div className="error__text">
            {nameError
              ? __('A membership name is required.')
              : descriptionError
              ? __('A membership description is required.')
              : undefined}
          </div>
          <div className="error__text">
            {hasSubscribers
              ? __("This membership has subscribers, you can't update the price currently.")
              : priceLowerThanMin
              ? __('Price must be greater or equal than %min%.', { min: MIN_PRICE })
              : priceHigherThanMax
              ? __('Price must be lower or equal than %max%.', { max: MAX_PRICE })
              : !editTierParams.editTierPrice
              ? __('A price is required.')
              : undefined}
          </div>
        </p>
      </div>
    </div>
  );
}

export default MembershipTier;
