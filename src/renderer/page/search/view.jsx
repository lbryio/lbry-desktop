// @flow
import * as SETTINGS from 'constants/settings';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import FileListSearch from 'component/fileListSearch';
import Page from 'component/page';
import ToolTip from 'component/common/tooltip';
import Icon from 'component/common/icon';

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
    this.props.setClientSetting(SETTINGS.RESULT_COUNT, count);
  }

  onShowUnavailableChange(event: SyntheticInputEvent<*>) {
    this.props.setClientSetting(SETTINGS.SHOW_UNAVAILABLE, event.target.checked);
  }

  render() {
    const { query, resultCount } = this.props;

    const isValid = isURIValid(query);

    let uri;
    let isChannel;
    if (isValid) {
      uri = normalizeURI(query);
      ({ isChannel } = parseURI(uri));
    }

    return (
      <Page noPadding>
        <section className="search">
          {query &&
            isValid && (
              <header className="search__header">
                <h1 className="search__title">
                  {`lbry://${query}`}
                  <ToolTip
                    icon
                    body={__(
                      'This is the resolution of a LBRY URL and not controlled by LBRY Inc.'
                    )}
                  >
                    <Icon icon={ICONS.HELP} />
                  </ToolTip>
                </h1>
                {isChannel ? (
                  <ChannelTile size="large" isSearchResult uri={uri} />
                ) : (
                  <FileTile size="large" isSearchResult displayHiddenMessage uri={uri} />
                )}
              </header>
            )}

          {/*
            Commented out until I figure out what to do with it in my next PR 
            <div>
              <FormField type="text" value={resultCount} label={__("Returned results")} / 
            </div>
          */}

          <div className="search__results-wrapper">
            <FileListSearch query={query} />
            <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
          </div>
        </section>
      </Page>
    );
  }
}

export default SearchPage;
