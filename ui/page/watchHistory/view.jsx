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

export const PAGE_VIEW_QUERY = 'view';

type Props = {
  history: Array<any>,
  doClearContentHistoryAll: () => void,
};

export default function WatchHistoryPage(props: Props) {
  const { history, doClearContentHistoryAll } = props;
  const [unavailableUris] = React.useState([]);
  const watchHistory = [];
  for (let entry of history) {
    if (entry.uri.indexOf('@') !== -1) {
      watchHistory.push(entry.uri);
    }
  }

  function clearHistory() {
    doClearContentHistoryAll();
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
        {watchHistory.length > 0 && <ClaimList uris={watchHistory} unavailableUris={unavailableUris} inWatchHistory />}
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
