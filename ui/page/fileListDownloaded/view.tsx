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
import { PURCHASES_PAGE_SIZE } from 'page/library/view';
import Spinner from 'component/spinner';

type Props = {
  fetchingFileList: boolean,
  downloadedUrls: Array<string>,
  downloadedUrlsCount: number | null | undefined,
  history: {
    replace: (arg1: string) => void
  },
  query: string,
  doPurchaseList: () => void,
  myDownloads: Array<string>,
  myPurchases: Array<string>,
  myPurchasesCount: number | null | undefined,
  fetchingMyPurchases: boolean
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

  function handleInputChange(e: unknown) {
// @ts-expect-error - TS2339 - Property 'target' does not exist on type 'unknown'.
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
            // @ts-expect-error - TS2322 (ts-migration)
            icon={ICONS.LIBRARY}
            label={__('Downloads')}
            className={classnames(`button-toggle`, {
              'button-toggle--active': viewMode === VIEW_DOWNLOADS,
            })}
            onClick={() => setViewMode(VIEW_DOWNLOADS)}
          />
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            icon={ICONS.PURCHASED}
            label={__('Purchases')}
            className={classnames(`button-toggle`, {
              'button-toggle--active': viewMode === VIEW_PURCHASES,
            })}
            onClick={() => setViewMode(VIEW_PURCHASES)}
          />
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          {loading && <Spinner type="small" />}
        </div>

{ /* @ts-expect-error - TS2769 - No overload matches this call. */}
        <Form onSubmit={() => {}} className="wunderbar--inline">
          <Icon icon={ICONS.SEARCH} />
          <FormField
// @ts-expect-error - TS2322 - Type '{ className: string; onChange: (e: unknown) => void; value: string; type: string; name: string; placeholder: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
            className="wunderbar__input--inline"
            onChange={handleInputChange}
            value={query}
            type="text"
            name="query"
            placeholder={__('Search')}
          />
        </Form>
      </div>
      <div>
        <ClaimList
          renderProperties={() => null}
          // @ts-expect-error - TS2322 (ts-migration)
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
    </>
  );
}

export default withRouter(FileListDownloaded);
