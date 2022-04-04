// @flow
import { SITE_NAME } from 'config';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  uri: string,
  claim: StreamClaim,
  hasChannels: boolean,
  doOpenModal: (string, {}) => void,
  doToast: ({ message: string }) => void,
};

export default function ClaimRepostButton(props: Props) {
  const { uri, claim, hasChannels, doOpenModal, doToast } = props;
  const [contentUri, setContentUri] = React.useState('');
  const [repostUri, setRepostUri] = React.useState('');

  return (
    <Button
      button="alt"
      className="button--file-action"
      icon={ICONS.REPOST}
      label={
        claim.meta.reposted > 1 ? __(`%repost_total% Reposts`, { repost_total: claim.meta.reposted }) : __('Repost')
      }
      description={__('Repost')}
      onClick={() => {
        if (!hasChannels) {
          doToast({
            message: __('A channel is required to repost on %SITE_NAME%', { SITE_NAME }),
            linkText: __('Create Channel'),
            linkTarget: '/channel/new',
          });
        } else {
          doOpenModal(MODALS.REPOST, { uri, contentUri, setContentUri, repostUri, setRepostUri, isModal: true });
        }
      }}
    />
  );
}
