// @flow
import * as React from 'react';
import * as settings from 'constants/settings';
import { isURIValid, normalizeURI } from 'lbry-redux';
import { FormField, FormRow } from 'component/common/form';
import FileTile from 'component/fileTile';
import FileListSearch from 'component/fileListSearch';
import Page from 'component/page';

type Props = {
  query: ?string,
  resultCount: number,
  setClientSetting: (string, number | boolean) => void,
};

class SearchPage extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).onShowUnavailableChange = this.onShowUnavailableChange.bind(this);
    (this: any).onSearchResultCountChange = this.onSearchResultCountChange.bind(this);
  }

  onSearchResultCountChange(event: SyntheticInputEvent<*>) {
    const count = Number(event.target.value);
    this.props.setClientSetting(settings.RESULT_COUNT, count);
  }

  onShowUnavailableChange(event: SyntheticInputEvent<*>) {
    this.props.setClientSetting(settings.SHOW_UNAVAILABLE, event.target.checked);
  }

  render() {
    const { query, resultCount } = this.props;
    return (
      <Page noPadding>
        {query &&
          isURIValid(query) && (
            <div className="search__top">
              <div className="file-list__header">{`lbry://${query}`}</div>
              <FileTile size="large" displayHiddenMessage uri={normalizeURI(query)} />
            </div>
          )}
        <div className="search__content">
          <FormRow alignRight>
            <FormField
              type="number"
              name="result_count"
              min={10}
              max={1000}
              value={resultCount}
              onChange={this.onSearchResultCountChange}
              postfix={__('returned results')}
            />
            {
              // Removing this for now, it currently doesn't do anything but ideally it would
              // display content that we don't think is currently available to download
              // It is like a "display all" setting
              // <FormField
              //   type="checkbox"
              //   name="show_unavailable"
              //   onChange={this.onShowUnavailableChange}
              //   checked={showUnavailable}
              //   postfix={__('Include unavailable content')}
              // />
            }
          </FormRow>
          <FileListSearch query={query} />
          <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
        </div>
      </Page>
    );
  }
}

export default SearchPage;
