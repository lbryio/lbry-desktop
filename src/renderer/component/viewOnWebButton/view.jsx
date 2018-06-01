// @flow
import React from 'react';
import * as icons from 'constants/icons';
import Button from 'component/button';

type Props = {
  uri: ?string,
};

export default (props: Props) => {
  const { uri } = props;

  return uri ? (
    <Button
      iconRight={icons.GLOBE}
      button="alt"
      label={__('View on Web')}
      href={`http://spee.ch/${uri}`}
    />
  ) : null;
};
