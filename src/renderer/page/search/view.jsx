// @flow
import * as React from 'react';
import * as settings from 'constants/settings';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import { FormField, FormRow } from 'component/common/form';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import FileListSearch from 'component/fileListSearch';
import Page from 'component/page';
import ToolTip from 'component/common/tooltip';
import Icon from 'component/common/icon';
import * as icons from 'constants/icons';

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

    const isValid = isURIValid(query);

    let uri;
    let isChannel;
    if (isValid) {
      uri = normalizeURI(query);
      ({ isChannel } = parseURI(uri));
    }

    return (
      <Page noPadding>
        {query &&
          isValid && (
            <div className="search__top">
              <div className="file-list__header">
                {`lbry://${query}`}
                <ToolTip
                  icon
                  body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
                >
                  <Icon icon={icons.HELP} />
                </ToolTip>
              </div>
              {isChannel ? (
                <ChannelTile size="large" uri={uri} />
              ) : (
                <FileTile size="large" displayHiddenMessage uri={uri} />
              )}
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
