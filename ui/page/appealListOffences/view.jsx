// @flow
import React from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';

type Props = {
  doOpenModal: (id: string, {}) => void,
};

export default function AppealListOffences(props: Props) {
  const { doOpenModal } = props;

  const blockerUris = [
    'lbry://@grumpy#3c98c9fc7988a1de4ac4ccfddab47416d9871c0d',
    'lbry://@timeout#8237fcdf9c3288d49cff1a3a609d680d486447ff',
  ];

  return (
    <Page noSideNavigation className="main--half-width" backout={{ backoutLabel: __('Cancel'), title: __('Offences') }}>
      <div className="help--notice">{HELP.OFFENCES}</div>
      <div className="section">
        <ClaimList
          uris={blockerUris}
          hideMenu
          renderProperties={() => null}
          renderActions={(claim) => {
            return (
              <div className="section__actions">
                <Button
                  button="secondary"
                  icon={ICONS.APPEAL}
                  label={__('Appeal')}
                  title={__(HELP.MANUAL_APPEAL)}
                  onClick={() => doOpenModal(MODALS.CONFIRM, { title: 'Not implemented yet.' })}
                />
                <Button
                  button="secondary"
                  icon={ICONS.LBC}
                  label={__('Auto Appeal')}
                  title={__(HELP.AUTO_APPEAL)}
                  onClick={() => doOpenModal(MODALS.CONFIRM, { title: 'Not implemented yet.' })}
                />
              </div>
            );
          }}
        />
      </div>
    </Page>
  );
}

// prettier-ignore
const HELP = {
  OFFENCES: 'These are creators that have blocked you. You can choose to appeal to the creator. If the creator has enabled automatic appeal (a.k.a swear jar), you can have your offences automatically pardoned by tipping the creator.',
  MANUAL_APPEAL: 'Appeal to the creator to remove you from their blocklist.',
  AUTO_APPEAL: 'The creator has enabled the auto-appeal process, where your offence can be automatically pardoned by tipping the creator.',
};
