// @flow
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';

type Props = {
  update: ([string, string]) => void,
};

const VALID_IPADDRESS_REGEX = new RegExp(
  '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\.)){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
);
const VALID_HOSTNAME_REGEX = new RegExp(
  '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])(\\.))+([A-Za-z]|[A-Za-z][A-Za-z]*[A-Za-z])$'
);
const VALID_PORT_REGEX = new RegExp('^([0-9]){1,5}$');

function ServerInputRow(props: Props) {
  const { update } = props;
  const [hostString, setHostString] = useState('');
  const [portString, setPortString] = useState('');
  const [validServerString, setValidServerString] = useState(false);

  useEffect(() => {
    setValidServerString(
      (VALID_IPADDRESS_REGEX.test(hostString) || VALID_HOSTNAME_REGEX.test(hostString)) &&
        VALID_PORT_REGEX.test(portString)
    );
  }, [hostString, portString, validServerString, setValidServerString]);

  function onSubmit() {
    update([hostString, portString]);
    setHostString('');
    setPortString('');
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="section__actions">
        <FormField
          type="text"
          label={__('Host')}
          placeholder={'code.freezepeach.fun'}
          value={hostString}
          onChange={e => setHostString(e.target.value)}
        />
        <span className="form-field__conjuction">:</span>
        <FormField
          type="number"
          label={__('Port')}
          placeholder={'50001'}
          value={portString}
          onChange={e => setPortString(String(e.target.value))}
        />
      </div>

      <div className="section__actions">
        <Button type="submit" button="primary" label={__('Add')} disabled={!validServerString} />
      </div>
    </Form>
  );
}

export default ServerInputRow;
