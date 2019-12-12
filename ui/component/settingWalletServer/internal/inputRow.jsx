// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  update: (string) => void,
};

const VALID_IPADDRESS_REGEX = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\.)){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
const VALID_HOSTNAME_REGEX = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])(\\.))+([A-Za-z]|[A-Za-z][A-Za-z]*[A-Za-z])$');
const VALID_PORT_REGEX = new RegExp('^([0-9]){1,5}$');

function ServerInputRow(props: Props) {
  const { update } = props;

  const [hostString, setHostString] = useState('');
  const [portString, setPortString] = useState('');
  const [validServerString, setValidServerString] = useState(false);

  useEffect(() => {
    setValidServerString((VALID_IPADDRESS_REGEX.test(hostString) || VALID_HOSTNAME_REGEX.test(hostString)) && VALID_PORT_REGEX.test(portString));
  }, [hostString, portString, validServerString, setValidServerString]);

  function onClick() {
    update([hostString, portString]);
    setHostString('');
    setPortString('');
  }

  return (
    <tr>
      <td>
        <FormField type="text" value={hostString} onChange={e => setHostString(e.target.value)} />
      </td>
      <td>
        <FormField type="text" value={portString} onChange={e => setPortString(e.target.value)} />
      </td>
      <td />
      <td>
        <Button button={'link'} icon={ICONS.ADD} disabled={!validServerString} onClick={onClick} />
      </td>
    </tr>
  );
}

export default ServerInputRow;
