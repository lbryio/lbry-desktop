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
import Native from 'native';
import SuggestedSubscriptions from 'component/subscribeSuggested';

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
      <HiddenNsfwClaims
        uris={subscriptions.reduce((arr, { name, claim_id: claimId }) => {
          if (name && claimId) {
            arr.push(`lbry://${name}#${claimId}`);
          }
          return arr;
        }, [])}
      />

      {hasSubscriptions && (
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
            onChange={onChangeAutoDownload}
            checked={autoDownload}
            prefix={__('Auto download')}
          />
        </div>
      )}

      {!hasSubscriptions && (
        <Fragment>
          <div className="page__empty--horizontal">
            <img
              alt="Sad gerbil"
              className="subscriptions__gerbil"
              src={Native.imagePath('gerbil-sad.png')}
            />
            <div className="card__content">
              <h2 className="card__title">{__('Oh no! What happened to your subscriptions?')}</h2>
              <p className="card__subtitle">{__('These channels look pretty cool.')}</p>
            </div>
          </div>
          <SuggestedSubscriptions />
        </Fragment>
      )}

      {hasSubscriptions && (
        <div className="card__content">
          {viewMode === VIEW_ALL && (
            <Fragment>
              <div className="card__title">{__('Your subscriptions')}</div>
              <FileList hideFilter sortByHeight fileInfos={subscriptions} />
            </Fragment>
          )}

          {viewMode === VIEW_LATEST_FIRST && (
            <Fragment>
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
                <Fragment>
                  <div className="page__empty">
                    <h3 className="card__title">{__('All caught up!')}</h3>
                    <p className="card__subtitle">{__('You might like these channels.')}</p>
                  </div>
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
