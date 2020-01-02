// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Paginate from 'component/common/paginate';
import { PAGE_SIZE } from 'constants/claim';
import { Form } from 'component/common/form-components/form';
import Icon from 'component/common/icon';
import * as ICONS from '../../constants/icons';
import { FormField } from '../../component/common/form-components/form-field';
import { withRouter } from 'react-router';
import Page from 'component/page';

type Props = {
  fetching: boolean,
  allDownloadedUrlsCount: number,
  downloadedUrls: Array<string>,
  downloadedUrlsCount: ?number,
  history: { replace: string => void },
  page: number,
  query: string,
};

function FileListDownloaded(props: Props) {
  const { fetching, history, query, allDownloadedUrlsCount, downloadedUrls, downloadedUrlsCount } = props;
  const hasDownloads = allDownloadedUrlsCount > 0;

  const [searchQuery, setSearchQuery] = useState('');

  function handleInputChange(e) {
    const { value } = e.target;
    if (value !== searchQuery) {
      setSearchQuery(value);
      history.replace(`?query=${value}&page=1`);
    }
  }

  return (
    <Page>
      {hasDownloads ? (
        <React.Fragment>
          <ClaimList
            header={__('Your Library')}
            headerAltControls={
              <Form onSubmit={() => {}} className="wunderbar--inline">
                <Icon icon={ICONS.SEARCH} />
                <FormField
                  className="wunderbar__input"
                  onChange={handleInputChange}
                  value={query}
                  type="text"
                  name="query"
                  placeholder={__('Search')}
                />
              </Form>
            }
            persistedStorageKey="claim-list-downloaded"
            empty={__('No results for %query%', { query })}
            uris={downloadedUrls}
            loading={fetching}
          />
          <Paginate totalPages={Math.ceil(Number(downloadedUrlsCount) / Number(PAGE_SIZE))} loading={fetching} />
        </React.Fragment>
      ) : (
        <div className="main--empty">
          <section className="card card--section">
            <h2 className="card__title card__title--deprecated">
              {__("You haven't downloaded anything from LBRY yet.")}
            </h2>
            <div className="card__actions card__actions--center">
              <Button button="primary" navigate="/" label={__('Explore new content')} />
            </div>
          </section>
        </div>
      )}
    </Page>
  );
}

export default withRouter(FileListDownloaded);
