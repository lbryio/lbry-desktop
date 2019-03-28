// @flow
import type { ViewMode } from 'types/subscription';
import type { Claim } from 'types/claim';
import { VIEW_ALL, VIEW_LATEST_FIRST } from 'constants/subscriptions';
import React, { Fragment } from 'react';
import Button from 'component/button';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import FileList from 'component/fileList';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import { parseURI } from 'lbry-redux';
import SuggestedSubscriptions from 'component/subscribeSuggested';
import MarkAsRead from 'component/subscribeMarkAsRead';
import Tooltip from 'component/common/tooltip';
import Yrbl from 'component/yrbl';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  viewMode: ViewMode,
  doSetViewMode: ViewMode => void,
  hasSubscriptions: boolean,
  subscriptions: Array<{ uri: string, ...Claim }>,
  autoDownload: boolean,
  onChangeAutoDownload: (SyntheticInputEvent<*>) => void,
  unreadSubscriptions: Array<{ channel: string, uris: Array<string> }>,
};

export default (props: Props) => {
  const {
    viewMode,
    doSetViewMode,
    hasSubscriptions,
    subscriptions,
    autoDownload,
    onChangeAutoDownload,
    unreadSubscriptions,
  } = props;
  return (
    <Fragment>
      {hasSubscriptions && (
        <section className="card card--section">
          <div className="card__content card--space-between">
            <div className="card__actions card__actions--no-margin">
              <Button
                disabled={viewMode === VIEW_ALL}
                selected={viewMode === VIEW_ALL}
                button="link"
                label="All Subscriptions"
                onClick={() => doSetViewMode(VIEW_ALL)}
              />
              <Button
                button="link"
                disabled={viewMode === VIEW_LATEST_FIRST}
                selected={viewMode === VIEW_LATEST_FIRST}
                label={__('Latest Only')}
                onClick={() => doSetViewMode(VIEW_LATEST_FIRST)}
              />
            </div>
            <Tooltip onComponent body={__('Automatically download new subscriptions.')}>
              <FormField
                type="setting"
                name="auto_download"
                onChange={onChangeAutoDownload}
                checked={autoDownload}
                label={__('Auto download')}
                labelOnLeft
              />
            </Tooltip>
          </div>
        </section>
      )}

      <HiddenNsfwClaims
        uris={subscriptions.reduce((arr, { name, claim_id: claimId }) => {
          if (name && claimId) {
            arr.push(`lbry://${name}#${claimId}`);
          }
          return arr;
        }, [])}
      />

      {!hasSubscriptions && (
        <Fragment>
          <Yrbl
            type="sad"
            title={__('Oh no! What happened to your subscriptions?')}
            subtitle={__('These channels look pretty cool.')}
          />
          <SuggestedSubscriptions />
        </Fragment>
      )}

      {hasSubscriptions && (
        <div className="card__content">
          {viewMode === VIEW_ALL && (
            <Fragment>
              <div className="card__title--flex">
                <h2 className="card__title">{__('Your subscriptions')}</h2>
                {unreadSubscriptions.length > 0 && <MarkAsRead />}
              </div>
              <FileList hideFilter sortByHeight fileInfos={subscriptions} />
            </Fragment>
          )}

          {viewMode === VIEW_LATEST_FIRST && (
            <Fragment>
              {unreadSubscriptions.length ? (
                unreadSubscriptions.map(({ channel, uris }) => {
                  const { claimName } = parseURI(channel);
                  return (
                    <span>
                      <h2 className="card__title card__title--flex">
                        <Button button="link" navigate={channel} label={claimName} />
                        <MarkAsRead channel={channel} />
                      </h2>

                      <section className="media-group--list" key={channel}>
                        <ul className="card__list">
                          {uris.map(uri => (
                            <FileCard key={uri} uri={uri} />
                          ))}
                        </ul>
                      </section>
                    </span>
                  );
                })
              ) : (
                <Fragment>
                  <Yrbl
                    title={__('All caught up!')}
                    subtitle={__('You might like the channels below.')}
                  />
                  <SuggestedSubscriptions />
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
};
