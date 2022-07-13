// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';

type Props = {
  id: string,
  // -- redux --
  loop: boolean,
  doToggleLoopList: (params: { collectionId: string }) => void,
};

const LoopButton = (props: Props) => {
  const { id, loop, doToggleLoopList } = props;

  return (
    <Button
      button="alt"
      className="button--alt-no-style button-toggle"
      title={__('Loop')}
      icon={ICONS.REPEAT}
      iconColor={loop ? 'blue' : undefined}
      onClick={() => doToggleLoopList({ collectionId: id })}
    />
  );
};

export default LoopButton;
