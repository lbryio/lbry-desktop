// @flow
import type { ViewMode } from 'types/subscription';
import type { Claim } from 'types/claim';
import { VIEW_ALL, VIEW_LATEST_FIRST } from 'constants/subscriptions';
import * as settings from 'constants/settings';
import * as React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import FileList from 'component/fileList';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import { parseURI } from 'lbry-redux';

type Props = {
  subscribedChannels: Array<string>, // The channels a user is subscribed to
  unreadSubscriptions: Array<{
    channel: string,
    uris: Array<string>,
  }>,
  allSubscriptions: Array<{ uri: string, ...Claim }>,
  loading: boolean,
  autoDownload: boolean,
  viewMode: ViewMode,
  doSetViewMode: ViewMode => void,
  doFetchMySubscriptions: () => void,
  doSetClientSetting: (string, boolean) => void,
};

export default class extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).onAutoDownloadChange = this.onAutoDownloadChange.bind(this);
  }

  componentDidMount() {
    const { doFetchMySubscriptions } = this.props;
    doFetchMySubscriptions();
  }

  onAutoDownloadChange(event: SyntheticInputEvent<*>) {
    this.props.doSetClientSetting(settings.AUTO_DOWNLOAD, event.target.checked);
  }

  renderSubscriptions() {
    const { viewMode, unreadSubscriptions, allSubscriptions } = this.props;

    if (viewMode === VIEW_ALL) {
      return (
        <React.Fragment>
          <div className="card__title">{__('Your subscriptions')}</div>
          <FileList hideFilter sortByHeight fileInfos={allSubscriptions} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {unreadSubscriptions.length ? (
          unreadSubscriptions.map(({ channel, uris }) => {
            const { claimName } = parseURI(channel);
            return (
              <section key={channel}>
                <div className="card__title">
                  <Button
                    button="link"
                    navigate="/show"
                    navigateParams={{ uri: channel }}
                    label={claimName}
                  />
                </div>
                <div className="card__list card__content">
                  {uris.map(uri => <FileCard isNew key={uri} uri={uri} />)}
                </div>
              </section>
            );
          })
        ) : (
          <div className="page__empty">
            <h3 className="card__title">{__('You are all caught up!')}</h3>
            <div className="card__actions">
              <Button button="primary" navigate="/discover" label={__('Explore new content')} />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  render() {
    const {
      subscribedChannels,
      allSubscriptions,
      loading,
      autoDownload,
      viewMode,
      doSetViewMode,
    } = this.props;

    return (
      // Only pass in the loading prop if there are no subscriptions
      // If there are any, let the page update in the background
      // The loading prop removes children and shows a loading spinner
      <Page notContained loading={loading && !subscribedChannels}>
        <HiddenNsfwClaims
          uris={allSubscriptions.reduce((arr, { name, claim_id: claimId }) => {
            if (name && claimId) {
              arr.push(`lbry://${name}#${claimId}`);
            }
            return arr;
          }, [])}
        />
        {!!subscribedChannels.length && (
          <div className="card--space-between">
            <div className="card__actions card__actions--no-margin">
              <Button
                disabled={viewMode === VIEW_ALL}
                button="link"
                label="All Subscriptions"
                onClick={() => doSetViewMode(VIEW_ALL)}
              />
              <Button
                button="link"
                disabled={viewMode === VIEW_LATEST_FIRST}
                label={__('Latest Only')}
                onClick={() => doSetViewMode(VIEW_LATEST_FIRST)}
              />
            </div>
            <FormField
              type="checkbox"
              name="auto_download"
              onChange={this.onAutoDownloadChange}
              checked={autoDownload}
              prefix={__('Auto download')}
            />
          </div>
        )}
        {!subscribedChannels.length && (
          <div className="page__empty">
            <h3 className="card__title">
              {__("It looks like you aren't subscribed to any channels yet.")}
            </h3>
            <div className="card__actions">
              <Button button="primary" navigate="/discover" label={__('Explore new content')} />
            </div>
          </div>
        )}
        {!!subscribedChannels.length && (
          <div className="card__content">{this.renderSubscriptions()}</div>
        )}
      </Page>
    );
  }
}
