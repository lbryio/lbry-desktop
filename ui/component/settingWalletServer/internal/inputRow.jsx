// @flow
import * as ICONS from 'constants/icons';
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  update: (string) => void,
};

function ServerInputRow(props: Props) {
  const { update } = props;
  const ValidIpAddressRegex = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\.)){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');
  const ValidHostnameRegex = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])(\\.))+([A-Za-z]|[A-Za-z][A-Za-z]*[A-Za-z])$');
  const ValidPortRegex = new RegExp('^([0-9]){1,5}$');

  const [hostString, setHostString] = useState('');
  const [portString, setPortString] = useState('');
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid((ValidIpAddressRegex.test(hostString) || ValidHostnameRegex.test(hostString)) && ValidPortRegex.test(portString));
  }, [hostString, portString, valid, setValid]);

  function onClick() {
    update([hostString, portString]);
    setHostString('');
    setPortString('');
  }

  return (
    <tr>
      <td> {/* host */}
        <FormField type="text" value={hostString} onChange={e => setHostString(e.target.value)}/>
      </td>
      <td> {/* port */}
        <FormField type="text" value={portString} onChange={e => setPortString(e.target.value)}/>
      </td>
      <td />
      <td>
        <Button button={'link'} icon={ICONS.ADD} disabled={!valid} onClick={onClick}/>
      </td>
    </tr>
  );
}

export default ServerInputRow;
