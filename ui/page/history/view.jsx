// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { YRBL_SAD_IMG_URL } from 'config';

import usePersistedState from 'effects/use-persisted-state';

export const PAGE_VIEW_QUERY = 'view';
// export const EDIT_PAGE = 'edit';

type Props = {
  collectionId: string,
  claim: Claim,
  title: string,
  thumbnail: string,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  // isMyClaim: boolean,
  // isMyCollection: boolean,
  // claimIsPending: boolean,
  // collectionHasEdits: boolean,
  // deleteCollection: (string, string) => void,
  // editCollection: (string, CollectionEditParams) => void,
  fetchCollectionItems: (string, () => void) => void,
  resolveUris: (string) => void,
  user: ?User,
};

export default function HistoryPage(props: Props) {
  const { collectionId } = props;
  const [history, setHistory] = usePersistedState('watch-history', []);
  const [unavailableUris] = React.useState([]);

  function clearHistory() {
    setHistory([]);
  }

  return (
    <Page className="historyPage-wrapper">
      <div className={classnames('section card-stack')}>
        <div className="claim-list__header">
          <h1 className="card__title">
            <Icon icon={ICONS.WATCHHISTORY} style={{ marginRight: 'var(--spacing-s)' }} />
            {__('Watch History')}
          </h1>

          <div className="claim-list__alt-controls--wrap">
            {history.length > 0 && (
              <Button
                title={__('Clear History')}
                button="primary"
                label={__('Clear History')}
                onClick={() => clearHistory()}
              />
            )}
          </div>
        </div>
        {history.length > 0 && (
          <ClaimList uris={history} collectionId={collectionId} unavailableUris={unavailableUris} inHistory />
        )}
        {history.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            <img src={YRBL_SAD_IMG_URL} />
            <h2 className="main--empty empty" style={{ marginTop: '0' }}>
              {__('Nothing here')}
            </h2>
          </div>
        )}
      </div>
    </Page>
  );
}
