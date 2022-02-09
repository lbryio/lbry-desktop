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
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  uri: string,
  nsfw: boolean,
  isNsfwBlocked: boolean,
  livestream?: boolean,
  isLive?: boolean,
  // redux
  channelClaimId?: string,
  title?: string,
  subCount: number,
  doFetchSubCount: (claimId: string) => void,
};

export default function FileTitleSection(props: Props) {
  const {
    uri,
    nsfw,
    isNsfwBlocked,
    livestream = false,
    isLive = false,
    subCount,
    channelClaimId,
    title,
    doFetchSubCount,
  } = props;

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (channelClaimId) doFetchSubCount(channelClaimId);
  }, [channelClaimId, doFetchSubCount]);

  return (
    <Card
      isPageTitle
      noTitleWrap
      title={
        <>
          {title}
          {nsfw && (
            <span className="media__title-badge">
              <span className="badge badge--tag-mature">{__('Mature')}</span>
            </span>
          )}
        </>
      }
      titleActions={<FilePrice uri={normalizeURI(uri)} type="filepage" />}
      body={
        <>
          <ClaimInsufficientCredits uri={uri} />
          <FileSubtitle uri={uri} isLive={isLive} livestream={livestream} />
        </>
      }
      actions={
        isNsfwBlocked ? (
          <div className="main--empty">
            <h2>
              <>
                <Icon className="icon--hidden" icon={ICONS.EYE_OFF} />
                {ENABLE_MATURE ? __('Mature content blocked.') : __('Mature content is not supported.')}
              </>
            </h2>
            <div>
              {ENABLE_MATURE ? (
                <I18nMessage
                  tokens={{
                    content_settings: (
                      <Button button="link" label={__('content settings')} navigate={`/$/${PAGES.SETTINGS}`} />
                    ),
                  }}
                >
                  Change this in your %content_settings%.
                </I18nMessage>
              ) : (
                <I18nMessage
                  tokens={{
                    download_url: <Button label={__('lbry.com')} button="link" href="https://lbry.com/get" />,
                  }}
                >
                  You can download the LBRY Desktop or Android app on %download_url% and enable mature content in
                  Settings.
                </I18nMessage>
              )}
            </div>
          </div>
        ) : (
          <>
            <ClaimAuthor channelSubCount={subCount} uri={uri} />
            <FileDescription expandOverride={isMobile && livestream} uri={uri} />
          </>
        )
      }
    />
  );
}
