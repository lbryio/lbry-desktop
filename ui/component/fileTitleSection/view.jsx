// @flow
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import FilePrice from 'component/filePrice';
import ClaimInsufficientCredits from 'component/claimInsufficientCredits';
import FileSubtitle from 'component/fileSubtitle';
import FileAuthor from 'component/fileAuthor';
import Card from 'component/common/card';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import FileDescription from 'component/fileDescription';

type Props = {
  uri: string,
  title: string,
  nsfw: boolean,
  isNsfwBlocked: boolean,
  livestream?: boolean,
  activeViewers?: number,
  stateOfViewers: string,
};

function FileTitleSection(props: Props) {
  const { title, uri, nsfw, isNsfwBlocked, livestream = false, activeViewers, stateOfViewers } = props;

  return (
    <Card
      isPageTitle
      noTitleWrap
      title={
        <React.Fragment>
          {title}
          {nsfw && (
            <span className="media__title-badge">
              <span className="badge badge--tag-mature">{__('Mature')}</span>
            </span>
          )}
        </React.Fragment>
      }
      titleActions={<FilePrice uri={normalizeURI(uri)} type="filepage" />}
      body={
        <React.Fragment>
          <ClaimInsufficientCredits uri={uri} />
          <FileSubtitle uri={uri} livestream={livestream} activeViewers={activeViewers} stateOfViewers={stateOfViewers} />
        </React.Fragment>
      }
      actions={
        isNsfwBlocked ? (
          <div className="main--empty">
            <h2>
              <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
              {__('Mature content blocked.')}
            </h2>
            <div>
              <I18nMessage
                tokens={{
                  content_settings: (
                    <Button button="link" label={__('content settings')} navigate={`/$/${PAGES.SETTINGS}`} />
                  ),
                }}
              >
                Change this in your %content_settings%.
              </I18nMessage>
            </div>
          </div>
        ) : (
          <div className="section">
            <FileAuthor uri={uri} />
            <FileDescription uri={uri} />
          </div>
        )
      }
    />
  );
}

export default FileTitleSection;
