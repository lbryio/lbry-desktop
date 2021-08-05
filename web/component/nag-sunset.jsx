// @flow
import React from 'react';
import Nag from 'component/common/nag';
import I18nMessage from 'component/i18nMessage';
import * as PAGES from 'constants/pages';
import { useHistory } from 'react-router';

type Props = {
  email?: User,
  onClose: () => void,
};
export default function NagSunset(props: Props) {
  const { email, onClose } = props;
  const { push } = useHistory();

  const handleOnClick = () => {
    onClose();
    push(`/$/${PAGES.AUTH_SIGNIN}`);
  };
  return (
    <Nag
      type="helpful"
      message={<I18nMessage>lbry.tv has been retired. You have been magically transported to odysee.com</I18nMessage>}
      actionText={__('Sign In')}
      onClick={!email ? handleOnClick : undefined}
      onClose={onClose}
    />
  );
}
