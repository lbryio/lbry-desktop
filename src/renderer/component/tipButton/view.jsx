// @flow
import React from 'react';
import * as icons from 'constants/icons';
import Button from 'component/button';
import { MODALS } from 'lbry-redux';

type Props = {
  uri: string,
  openModal: ({ id: string }, { uri: string }) => any,
};

export default (props: Props) => {
  const { openModal, uri } = props;
  return (
    <Button
      button="alt"
      icon={icons.GIFT}
      label={__('Tip the creator')}
      onClick={() => openModal({ id: MODALS.SEND_TIP }, { uri })}
    />
  );
};
