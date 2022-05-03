// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { YRBL_SAD_IMG_URL } from 'config';
import Tooltip from 'component/common/tooltip';
import usePersistedState from 'effects/use-persisted-state';

export const PAGE_VIEW_QUERY = 'view';

type Props = {
  collectionId: string,
  claim: Claim,
  title: string,
  thumbnail: string,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
  fetchCollectionItems: (string, () => void) => void,
  resolveUris: (string) => void,
  user: ?User,
};

export default function WatchHistoryPage(props: Props) {
  const { collectionId } = props;
  const [watchHistory, setWatchHistory] = usePersistedState('watch-history', []);
  const [unavailableUris] = React.useState([]);

  function clearHistory() {
    setWatchHistory([]);
  }

  return (
    <Page className="historyPage-wrapper">
      <div className={classnames('section card-stack')}>
        <div className="claim-list__header">
          <h1 className="card__title">
            <Icon icon={ICONS.WATCH_HISTORY} style={{ marginRight: 'var(--spacing-s)' }} />
            {__('Watch History')}
            <Tooltip title={__('Currently, your watch history is only saved locally.')}>
              <Button className="icon--help" icon={ICONS.HELP} iconSize={14} />
            </Tooltip>
          </h1>

          <div className="claim-list__alt-controls--wrap">
            {watchHistory.length > 0 && (
              <Button
                title={__('Clear History')}
                button="primary"
                label={__('Clear History')}
                onClick={() => clearHistory()}
              />
            )}
          </div>
        </div>
        {watchHistory.length > 0 && (
          <ClaimList uris={watchHistory} collectionId={collectionId} unavailableUris={unavailableUris} inWatchHistory />
        )}
        {watchHistory.length === 0 && (
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
