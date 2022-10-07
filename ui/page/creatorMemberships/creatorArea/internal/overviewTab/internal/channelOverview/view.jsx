// @flow
import React from 'react';

import { URL } from 'config';
import { formatLbryUrlForWeb } from 'util/url';

import * as ICONS from 'constants/icons';

import CopyableText from 'component/copyableText';
import ChannelThumbnail from 'component/channelThumbnail';
import ButtonNavigateChannelId from 'component/buttonNavigateChannelId';
import TruncatedText from 'component/common/truncated-text';

type Props = {
  channelClaim: ChannelClaim,
  // -- redux --
  supportersAmount: number,
  monthlyIncome: number,
};

const ChannelOverview = (props: Props) => {
  const { channelClaim, supportersAmount, monthlyIncome } = props;

  return (
    <>
      <td className="channelThumbnail">
        <ChannelThumbnail xsmall uri={channelClaim.canonical_url} />
      </td>

      <td>
        <TruncatedText text={channelClaim.value.title || channelClaim.name} lines={1} />
      </td>

      <td>{supportersAmount}</td>
      <td>${(monthlyIncome / 100).toFixed(2)}</td>
      <td>$0</td>

      <td>
        <ButtonNavigateChannelId
          button="primary"
          channelId={channelClaim.claim_id}
          icon={ICONS.MEMBERSHIP}
          navigate={`${formatLbryUrlForWeb(channelClaim.canonical_url)}?view=membership`}
        />
      </td>

      <td className="membership-table__url">
        <CopyableText
          onlyCopy
          primaryButton
          copyable={`${URL}${formatLbryUrlForWeb(channelClaim.canonical_url)}?view=membership`}
          snackMessage={__('Page location copied')}
        />
      </td>
    </>
  );
};

export default ChannelOverview;
