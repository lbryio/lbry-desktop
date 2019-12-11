// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Icon from 'component/common/icon';

type Props = {
  host: string,
  port: string,
  available: boolean,
  index: number,
  remove: number => void,
};

function ServerDisplayRow(props: Props) {
  const { host, port, available, index, remove } = props;
  return (
    <tr>
      <td className="table__item--actionable">
        {host}
      </td>
      <td className="table__item--actionable">
        {port}
      </td>
      <td>
        {available &&  <Icon icon={ICONS.SUBSCRIBE} />}
      </td>
      <td>
        <Button button={'link'} icon={ICONS.REMOVE} onClick={() => remove(index)} />
      </td>
    </tr>
  );
}

export default ServerDisplayRow;
