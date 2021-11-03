// @flow
import * as React from 'react';
import { normalizeURI } from 'util/lbryURI';
import FilePrice from 'component/filePrice';
import ClaimInsufficientCredits from 'component/claimInsufficientCredits';
import FileSubtitle from 'component/fileSubtitle';
import ClaimAuthor from 'component/claimAuthor';
import Card from 'component/common/card';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';
import Button from 'component/button';
import FileDescription from 'component/fileDescription';
import { ENABLE_MATURE } from 'config';

type Props = {
  uri: string,
  title: string,
  nsfw: boolean,
  isNsfwBlocked: boolean,
  livestream?: boolean,
  isLive?: boolean,
  viewers?: number,
  subCount: number,
  channelClaimId?: string,
  fetchSubCount: (string) => void,
};

function FileTitleSection(props: Props) {
  const {
    title,
    uri,
    nsfw,
    isNsfwBlocked,
    livestream = false,
    isLive = false,
    viewers,
    subCount,
    channelClaimId,
    fetchSubCount,
  } = props;

  React.useEffect(() => {
    if (channelClaimId) {
      fetchSubCount(channelClaimId);
    }
  }, [channelClaimId, fetchSubCount]);

  return (
    <>
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
            <FileSubtitle uri={uri} isLive={isLive} livestream={livestream} activeViewers={viewers} />
          </React.Fragment>
        }
        actions={
          isNsfwBlocked ? (
            <div className="main--empty">
              <h2>
                {!ENABLE_MATURE && (
                  <>
                    <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
                    {__('Mature content is not supported.')}
                  </>
                )}
                {ENABLE_MATURE && (
                  <>
                    <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
                    {__('Mature content blocked.')}
                  </>
                )}
              </h2>
              <div>
                {ENABLE_MATURE && (
                  <>
                    <I18nMessage
                      tokens={{
                        content_settings: (
                          <Button button="link" label={__('content settings')} navigate={`/$/${PAGES.SETTINGS}`} />
                        ),
                      }}
                    >
                      Change this in your %content_settings%.
                    </I18nMessage>
                  </>
                )}
                {!ENABLE_MATURE && (
                  <>
                    <I18nMessage
                      tokens={{
                        download_url: <Button label={__('lbry.com')} button="link" href="https://lbry.com/get" />,
                      }}
                    >
                      You can download the LBRY Desktop or Android app on %download_url% and enable mature content in
                      Settings.
                    </I18nMessage>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="section">
              <ClaimAuthor channelSubCount={subCount} uri={uri} />
              <FileDescription uri={uri} />
            </div>
          )
        }
      />
    </>
  );
}

export default FileTitleSection;
