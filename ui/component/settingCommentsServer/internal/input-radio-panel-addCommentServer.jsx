// @flow
import React, { useState, useEffect } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { VALID_IPADDRESS_REGEX, VALID_HOSTNAME_REGEX, VALID_ENDPOINT_REGEX } from 'constants/protocol_regex';

type Props = {
  update: (CommentServerDetails) => void,
  onCancel: (boolean) => void,
};

const isValidServerString = (serverString) => {
  const si = serverString.indexOf('/');
  const pi = serverString.indexOf(':');
  const path = si === -1 ? '' : serverString.slice(si);
  const hostMaybePort = si === -1 ? serverString : serverString.slice(0, si);
  const host = pi === -1 ? hostMaybePort : hostMaybePort.slice(0, pi);
  const port = pi === -1 ? '' : hostMaybePort.slice(pi + 1);
  const portInt = parseInt(port);

  return (
    (host === 'localhost' || VALID_IPADDRESS_REGEX.test(host) || VALID_HOSTNAME_REGEX.test(host)) &&
    (!path || VALID_ENDPOINT_REGEX.test(path)) &&
    // eslint-disable-next-line
    (pi === -1 || (port && typeof portInt === 'number' && portInt === portInt))
  ); // NaN !== NaN
};

function ServerInputRow(props: Props) {
  const { update, onCancel } = props;
  const [nameString, setNameString] = useState('');
  const [hostString, setHostString] = useState('');
  const [useHttps, setUseHttps] = useState(true);

  const getHostString = () => {
    return `${useHttps ? 'https://' : 'http://'}${hostString}`;
  };

  const [validServerString, setValidServerString] = useState(false);

  useEffect(() => {
    setValidServerString(isValidServerString(hostString));
  }, [hostString, validServerString, setValidServerString]);

  function onSubmit() {
    const updateValue = { url: getHostString(), name: nameString };
    update(updateValue);
    setHostString('');
    setNameString('');
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="input-toggle-panel--input">
        <FormField
          type="text"
          label={__('Name')}
          placeholder={'My Server'}
          value={nameString}
          onChange={(e) => setNameString(e.target.value)}
        />
        <div className="fieldset-group fieldset-group--smushed fieldset-group--disabled-prefix fieldset-group--row">
          <div className={'fieldset-section'}>
            <label htmlFor="serverUrl">{__('URL')}</label>
            <div className="form-field__prefix">{`${useHttps ? 'https://' : 'http://'}`}</div>
          </div>
          <FormField
            type="text"
            placeholder={'code.freezepeach.fun'}
            value={hostString}
            onChange={(e) => setHostString(e.target.value)}
            name={'serverUrl'}
          />
        </div>
      </div>
      <div className="input-toggle-panel--input">
        <FormField
          label={'Use https'}
          name="use_https"
          type="checkbox"
          checked={useHttps}
          onChange={() => setUseHttps(!useHttps)}
        />
      </div>

      <div className="section__actions">
        <Button type="submit" button="primary" label={__('Add')} disabled={!validServerString || !nameString} />
        <Button type="button" button="link" onClick={() => onCancel(false)} label={__('Cancel')} />
      </div>
    </Form>
  );
}

export default ServerInputRow;
