// @flow
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
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';

type Props = {
  viewMode: ViewMode,
  doSetViewMode: ViewMode => void,
  hasSubscriptions: boolean,
  subscriptions: Array<{ uri: string, ...StreamClaim }>,
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

  const index = viewMode === VIEW_ALL ? 0 : 1;
  const onTabChange = index => (index === 0 ? doSetViewMode(VIEW_ALL) : doSetViewMode(VIEW_LATEST_FIRST));

  return (
    <Fragment>
      {hasSubscriptions && (
        <Tabs onChange={onTabChange} index={index}>
          <TabList className="main__item--extend-outside">
            <Tab>{__('All Subscriptions')}</Tab>
            <Tab>{__('Latest Only')}</Tab>

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
          </TabList>

          <TabPanels
            header={
              <HiddenNsfwClaims
                uris={subscriptions.reduce((arr, { name, claim_id: claimId }) => {
                  if (name && claimId) {
                    arr.push(`lbry://${name}#${claimId}`);
                  }
                  return arr;
                }, [])}
              />
            }
          >
            <TabPanel>
              <div className="card__title card__title--flex">
                <span>{__('Your subscriptions')}</span>
                {unreadSubscriptions.length > 0 && <MarkAsRead />}
              </div>
              <FileList hideFilter sortByHeight fileInfos={subscriptions} />
            </TabPanel>

            <TabPanel>
              {unreadSubscriptions.length ? (
                unreadSubscriptions.map(({ channel, uris }) => {
                  const { claimName } = parseURI(channel);
                  return (
                    <section key={channel}>
                      <h2 className="card__title card__title--flex">
                        <Button button="link" navigate={channel} label={claimName} />
                        <MarkAsRead channel={channel} />
                      </h2>

                      <section className="media-group--list">
                        <ul className="card__list">
                          {uris.map(uri => (
                            <FileCard key={uri} uri={uri} />
                          ))}
                        </ul>
                      </section>
                    </section>
                  );
                })
              ) : (
                <Fragment>
                  <Yrbl title={__('All caught up!')} subtitle={__('You might like the channels below.')} />
                  <SuggestedSubscriptions />
                </Fragment>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

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
    </Fragment>
  );
};
