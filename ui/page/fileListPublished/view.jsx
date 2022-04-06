// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React, { useEffect, useMemo } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Paginate from 'component/common/paginate';
import { PAGE_PARAM, PAGE_SIZE_PARAM } from 'constants/claim';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import { FormField, Form } from 'component/common/form';
import Icon from 'component/common/icon';
import classnames from 'classnames';

const FILTER_ALL = 'stream,repost';
const FILTER_UPLOADS = 'stream';
const FILTER_REPOSTS = 'repost';

type Props = {
  checkPendingPublishes: () => void,
  clearPublish: () => void,
  fetching: boolean,
  history: { replace: (string) => void, push: (string) => void },
  page: number,
  pageSize: number,
  myClaims: any,
  fetchAllMyClaims: () => void,
};

function FileListPublished(props: Props) {
  const { checkPendingPublishes, clearPublish, fetching, page, pageSize, myClaims, fetchAllMyClaims } = props;

  const [filterBy, setFilterBy] = React.useState(FILTER_ALL);
  const [searchText, setSearchText] = React.useState('');
  const params = {};

  params[PAGE_PARAM] = Number(page);
  params[PAGE_SIZE_PARAM] = Number(pageSize);

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    checkPendingPublishes();
  }, [checkPendingPublishes]);

  const filteredClaims = useMemo(() => {
    if (fetching) {
      return [];
    }

    return myClaims.filter((claim) => {
      const value = claim.value || {};
      const src = value.source || {};
      const title = (value.title || '').toLowerCase();
      const description = (value.description || '').toLowerCase();
      const tags = (value.tags || []).join('').toLowerCase();
      const srcName = (src.name || '').toLowerCase();
      const lowerCaseSearchText = searchText.toLowerCase();
      const textMatches =
        !searchText ||
        title.indexOf(lowerCaseSearchText) !== -1 ||
        description.indexOf(lowerCaseSearchText) !== -1 ||
        tags.indexOf(lowerCaseSearchText) !== -1 ||
        srcName.indexOf(lowerCaseSearchText) !== -1;
      return textMatches && filterBy.includes(claim.value_type);
    });
  }, [fetching, myClaims, filterBy, searchText]);

  const urlTotal = filteredClaims.length;

  const urls = useMemo(() => {
    const params = JSON.parse(paramsString);
    const zeroIndexPage = Math.max(0, params.page - 1);
    const paginated = filteredClaims.slice(
      zeroIndexPage * params.page_size,
      zeroIndexPage * params.page_size + params.page_size
    );
    return paginated.map((claim) => claim.permanent_url);
  }, [filteredClaims, paramsString]);

  useEffect(() => {
    fetchAllMyClaims();
  }, [fetchAllMyClaims]);

  return (
    <Page>
      <div className="card-stack">
        {!!urls && (
          <>
            <ClaimList
              noEmpty
              header={
                <span>
                  <Button
                    button="alt"
                    label={__('All')}
                    aria-label={__('All uploads')}
                    onClick={() => setFilterBy(FILTER_ALL)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_ALL,
                    })}
                  />
                  <Button
                    button="alt"
                    label={__('Uploads')}
                    onClick={() => setFilterBy(FILTER_UPLOADS)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_UPLOADS,
                    })}
                  />
                  <Button
                    button="alt"
                    label={__('Reposts')}
                    onClick={() => setFilterBy(FILTER_REPOSTS)}
                    className={classnames(`button-toggle`, {
                      'button-toggle--active': filterBy === FILTER_REPOSTS,
                    })}
                  />
                </span>
              }
              headerAltControls={
                <div className="card__actions--inline">
                  {fetching && <Spinner type="small" />}
                  {!fetching && (
                    <Button button="alt" label={__('Refresh')} icon={ICONS.REFRESH} onClick={fetchAllMyClaims} />
                  )}
                  <Form onSubmit={() => {}} className="wunderbar--inline">
                    <Icon icon={ICONS.SEARCH} />
                    <FormField
                      className="wunderbar__input--inline"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      type="text"
                      placeholder={__('Search')}
                    />
                  </Form>
                </div>
              }
              persistedStorageKey="claim-list-published"
              uris={urls}
            />
            <Paginate totalPages={urlTotal > 0 ? Math.ceil(urlTotal / Number(pageSize)) : 1} />
          </>
        )}
      </div>
      {!fetching && myClaims.length === 0 && (
        <React.Fragment>
          {!fetching ? (
            <section className="main--empty">
              <Yrbl
                title={filterBy === FILTER_REPOSTS ? __('No Reposts') : __('No uploads')}
                subtitle={
                  filterBy === FILTER_REPOSTS
                    ? __("You haven't reposted anything yet. Do it.")
                    : __("You haven't uploaded anything yet. This is where you can find them when you do!")
                }
                actions={
                  filterBy !== FILTER_REPOSTS && (
                    <div className="section__actions">
                      <Button
                        button="primary"
                        navigate={`/$/${PAGES.UPLOAD}`}
                        label={__('Upload Something New')}
                        onClick={() => clearPublish()}
                      />
                    </div>
                  )
                }
              />
            </section>
          ) : (
            <section className="main--empty">
              <Spinner delayed />
            </section>
          )}
        </React.Fragment>
      )}
    </Page>
  );
}

export default FileListPublished;
