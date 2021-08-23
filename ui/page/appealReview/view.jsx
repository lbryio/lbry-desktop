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

export default function AppealReview(props: Props) {
  const { doOpenModal } = props;

  const appellantUris = [
    'lbry://@grumpy#3c98c9fc7988a1de4ac4ccfddab47416d9871c0d',
    'lbry://@timeout#8237fcdf9c3288d49cff1a3a609d680d486447ff',
  ];

  return (
    <Page
      noSideNavigation
      className="main--half-width"
      backout={{ backoutLabel: __('Cancel'), title: __('Review Appeals') }}
    >
      <div className="help--notice">{HELP.APPELLANTS}</div>
      <div className="section">
        <ClaimList
          uris={appellantUris}
          hideMenu
          renderProperties={() => null}
          renderActions={(claim) => {
            return (
              <div className="section__actions">
                <Button
                  button="secondary"
                  icon={ICONS.COMPLETE}
                  label={__('Approve')}
                  onClick={() => doOpenModal(MODALS.CONFIRM, { title: 'Not implemented -- waiting for API' })}
                />
                <Button
                  button="secondary"
                  icon={ICONS.REMOVE}
                  label={__('Reject')}
                  onClick={() => doOpenModal(MODALS.CONFIRM, { title: 'Not implemented -- waiting for API' })}
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
  APPELLANTS: 'The following users have requested an appeal against blocking their channel.',
};
