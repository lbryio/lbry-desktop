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
  subCount: number,
  channelClaimId?: string,
  fetchSubCount: (arg1: string) => void
};

function FileTitleSection(props: Props) {
  const { title, uri, nsfw, isNsfwBlocked, subCount, channelClaimId, fetchSubCount } = props;

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
            {/* @ts-expect-error - TS2741 (ts-migration) */}
            <ClaimInsufficientCredits uri={uri} />
            <FileSubtitle uri={uri} />
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
                    {/* @ts-expect-error - TS2745 (ts-migration) */}
                    <I18nMessage
                      // @ts-expect-error - TS2322 (ts-migration)
                      tokens={{
                        content_settings: (
                          // @ts-expect-error - TS2322 (ts-migration)
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
                    {/* @ts-expect-error - TS2745 (ts-migration) */}
                    <I18nMessage
                      // @ts-expect-error - TS2322 (ts-migration)
                      tokens={{
                        // @ts-expect-error - TS2322 (ts-migration)
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
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <ClaimAuthor channelSubCount={subCount} uri={uri} />
              {/* @ts-expect-error - TS2741 (ts-migration) */}
              <FileDescription uri={uri} />
            </div>
          )
        }
      />
    </>
  );
}

export default FileTitleSection;
