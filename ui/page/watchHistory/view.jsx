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
import useClaimListInfiniteScroll from 'effects/use-claimList-infinite-scroll';

export const PAGE_SIZE = 30;

type Props = {
  historyUris: Array<string>,
  doClearContentHistoryAll: () => void,
  doResolveUris: (uris: Array<string>, returnCachedClaims: boolean, resolveReposts: boolean) => void,
};

export default function WatchHistoryPage(props: Props) {
  const { historyUris, doClearContentHistoryAll, doResolveUris } = props;
  const { uris, page, isLoadingPage, bumpPage } = useClaimListInfiniteScroll(
    historyUris,
    doResolveUris,
    PAGE_SIZE,
    true
  );

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
            {uris.length > 0 && (
              <Button
                title={__('Clear History')}
                button="primary"
                label={__('Clear History')}
                onClick={() => clearHistory()}
              />
            )}
          </div>
        </div>
        {uris.length > 0 && (
          <ClaimList
            uris={uris.slice(0, (page + 1) * PAGE_SIZE)}
            onScrollBottom={bumpPage}
            page={page + 1}
            pageSize={PAGE_SIZE}
            loading={isLoadingPage}
            useLoadingSpinner
            inWatchHistory
          />
        )}
        {uris.length === 0 && (
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
