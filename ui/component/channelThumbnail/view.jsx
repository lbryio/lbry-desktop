// @flow
import React from 'react';
import { parseURI } from 'util/lbryURI';
import classnames from 'classnames';
import Gerbil from './gerbil.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';
import OptimizedImage from 'component/optimizedImage';
import { AVATAR_DEFAULT } from 'config';
import useGetUserMemberships from 'effects/use-get-user-memberships';
import PremiumBadge from 'component/common/premium-badge';

type Props = {
  thumbnail: ?string,
  uri: string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
  xsmall?: boolean,
  allowGifs?: boolean,
  claim: ?ChannelClaim,
  doResolveUri: (string) => void,
  isResolving: boolean,
  noLazyLoad?: boolean,
  hideStakedIndicator?: boolean,
  hideTooltip?: boolean,
  noOptimization?: boolean,
  setThumbUploadError: (boolean) => void,
  ThumbUploadError: boolean,
  claimsByUri: { [string]: any },
  odyseeMembership: string,
  doFetchUserMemberships: (claimIdCsv: string) => void,
  showMemberBadge?: boolean,
  isChannel?: boolean,
  checkMembership: boolean,
};

function ChannelThumbnail(props: Props) {
  const {
    thumbnail: rawThumbnail,
    uri,
    className,
    thumbnailPreview: rawThumbnailPreview,
    obscure,
    small = false,
    xsmall = false,
    allowGifs = false,
    claim,
    doResolveUri,
    isResolving,
    noLazyLoad,
    hideTooltip,
    setThumbUploadError,
    ThumbUploadError,
    claimsByUri,
    odyseeMembership,
    doFetchUserMemberships,
    showMemberBadge,
    isChannel,
    checkMembership = true,
  } = props;
  const [thumbLoadError, setThumbLoadError] = React.useState(ThumbUploadError);
  const shouldResolve = !isResolving && claim === undefined;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, 'https://');
  const defaultAvatar = AVATAR_DEFAULT || Gerbil;
  const channelThumbnail = thumbnailPreview || thumbnail || defaultAvatar;
  const isGif = channelThumbnail && channelThumbnail.endsWith('gif');
  const showThumb = (!obscure && !!thumbnail) || thumbnailPreview;

  const badgeProps = {
    membership: odyseeMembership,
    linkPage: isChannel,
    placement: isChannel ? 'bottom' : undefined,
    hideTooltip,
    className: isChannel ? 'profile-badge__tooltip' : undefined,
  };

  useGetUserMemberships(checkMembership, [uri], claimsByUri, doFetchUserMemberships, [uri]);

  // Generate a random color class based on the first letter of the channel name
  const { channelName } = parseURI(uri);
  let initializer;
  let colorClassName;
  if (channelName) {
    initializer = channelName.charCodeAt(0) - 65; // will be between 0 and 57
    colorClassName = `channel-thumbnail__default--${Math.abs(initializer % 4)}`;
  } else {
    colorClassName = `channel-thumbnail__default--4`;
  }

  React.useEffect(() => {
    if (shouldResolve && uri) {
      doResolveUri(uri);
    }
  }, [doResolveUri, shouldResolve, uri]);

  if (isGif && !allowGifs) {
    return (
      <FreezeframeWrapper src={channelThumbnail} className={classnames('channel-thumbnail', className)}>
        {showMemberBadge && <PremiumBadge {...badgeProps} />}
      </FreezeframeWrapper>
    );
  }

  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !showThumb,
        'channel-thumbnail--small': small,
        'channel-thumbnail--xsmall': xsmall,
        'channel-thumbnail--resolving': isResolving,
      })}
    >
      <OptimizedImage
        alt={__('Channel profile picture')}
        className={!channelThumbnail ? 'channel-thumbnail__default' : 'channel-thumbnail__custom'}
        src={(!thumbLoadError && channelThumbnail) || defaultAvatar}
        loading={noLazyLoad ? undefined : 'lazy'}
        onError={() => {
          if (setThumbUploadError) {
            setThumbUploadError(true);
          } else {
            setThumbLoadError(true);
          }
        }}
      />
      {showMemberBadge && <PremiumBadge {...badgeProps} />}
    </div>
  );
}

export default ChannelThumbnail;
