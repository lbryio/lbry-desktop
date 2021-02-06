// @flow
import * as ICONS from 'constants/icons';
import React, { useState } from 'react';
import usePersistedState from 'effects/use-persisted-state';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Paginate from 'component/common/paginate';
import { PAGE_SIZE } from 'constants/claim';
import { Form } from 'component/common/form-components/form';
import Icon from 'component/common/icon';
import { FormField } from 'component/common/form-components/form-field';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import Yrbl from 'component/yrbl';
import { PURCHASES_PAGE_SIZE } from 'page/library/view';
import Spinner from 'component/spinner';

type Props = {
  fetchingFileList: boolean,
  downloadedUrls: Array<string>,
  downloadedUrlsCount: ?number,
  history: { replace: (string) => void },
  query: string,
  doPurchaseList: () => void,
  myDownloads: Array<string>,
  myPurchases: Array<string>,
  myPurchasesCount: ?number,
  fetchingMyPurchases: boolean,
};

const VIEW_DOWNLOADS = 'view_download';
const VIEW_PURCHASES = 'view_purchases';

function FileListDownloaded(props: Props) {
  const {
    history,
    query,
    downloadedUrlsCount,
    myPurchasesCount,
    myPurchases,
    myDownloads,
    fetchingFileList,
    fetchingMyPurchases,
  } = props;
  const loading = fetchingFileList || fetchingMyPurchases;
  const [viewMode, setViewMode] = usePersistedState('library-view-mode', VIEW_PURCHASES);
  const [searchQuery, setSearchQuery] = useState('');

  function handleInputChange(e) {
    const { value } = e.target;
    if (value !== searchQuery) {
      setSearchQuery(value);
      history.replace(`?query=${value}&page=1`);
    }
  }

  return (
    <>
      <div className="section__header--actions">
        <div className="section__actions--inline">
          <Button
            icon={ICONS.LIBRARY}
            button="alt"
            label={__('Downloads')}
            className={classnames(`button-toggle`, {
              'button-toggle--active': viewMode === VIEW_DOWNLOADS,
            })}
            onClick={() => setViewMode(VIEW_DOWNLOADS)}
          />
          <Button
            icon={ICONS.PURCHASED}
            button="alt"
            label={__('Purchases')}
            className={classnames(`button-toggle`, {
              'button-toggle--active': viewMode === VIEW_PURCHASES,
            })}
            onClick={() => setViewMode(VIEW_PURCHASES)}
          />
          {loading && <Spinner type="small" />}
        </div>

        <Form onSubmit={() => {}} className="wunderbar--inline">
          <Icon icon={ICONS.SEARCH} />
          <FormField
            className="wunderbar__input--inline"
            onChange={handleInputChange}
            value={query}
            type="text"
            name="query"
            placeholder={__('Search')}
          />
        </Form>
      </div>
      {IS_WEB && viewMode === VIEW_DOWNLOADS ? (
        <div className="main--empty">
          <Yrbl
            title={__('Try out the app!')}
            subtitle={
              <p className="section__subtitle">{__("Download the app to track files you've viewed and downloaded.")}</p>
            }
            actions={
              <div className="section__actions">
                <Button button="primary" label={__('Get The App')} href="https://lbry.com/get" />
              </div>
            }
          />
        </div>
      ) : (
        <div>
          <ClaimList
            renderProperties={() => null}
            empty={
              viewMode === VIEW_PURCHASES && !query ? (
                <div>{__('No purchases found.')}</div>
              ) : (
                __('No results for %query%', { query })
              )
            }
            uris={viewMode === VIEW_PURCHASES ? myPurchases : myDownloads}
            loading={loading}
          />
          {!query && (
            <Paginate
              totalPages={Math.ceil(
                Number(viewMode === VIEW_PURCHASES ? myPurchasesCount : downloadedUrlsCount) /
                  Number(viewMode === VIEW_PURCHASES ? PURCHASES_PAGE_SIZE : PAGE_SIZE)
              )}
            />
          )}
        </div>
      )}
    </>
  );
}

export default withRouter(FileListDownloaded);
