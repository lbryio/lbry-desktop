// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';
import Lbry from 'lbry';
import { clipboard } from 'electron';
import * as ICONS from 'constants/icons';
import FileExporter from 'component/common/file-exporter';

type Props = {
  toast: (string, boolean) => void,
};

function WalletExport(props: Props) {
  const { toast } = props;

  const [password, setPassword] = React.useState();
  const [data, setData] = React.useState();
  const [fetching, setFetching] = React.useState();
  const getData = async (password) => {
    setFetching(true);
    const data = await Lbry.sync_apply({ password });
    setFetching(false);
    setData(data);
  };

  return (
    <Card
      title={__('Export Wallet')}
      subtitle={
        data
          ? __('Your Sync Data is prepared. You can now copy or save it.')
          : __('Export wallet sync data. Choose a secure password you will need for import.')
      }
      actions={
        <React.Fragment>
          {!data && (
            <Form onSubmit={() => alert()}>
              <FormField
                autoFocus
                type="password"
                name="password_set"
                label={__('Choose Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="section__actions--between">
                <Button button={'primary'} onClick={() => getData(password)} label={'Get Data'} disabled={fetching} />
              </div>
            </Form>
          )}
          {data && (
            <div className="section__actions">
              <div className="section__actions--between">
                <FileExporter data={JSON.stringify(data)} label={'Download'} defaultFileName={'data.json'} />
                <Button
                  button={'secondary'}
                  onClick={() => {
                    clipboard.writeText(JSON.stringify(data));
                    toast(__('Sync data copied.'), false);
                  }}
                  label={'Copy Data'}
                  icon={ICONS.COPY}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      }
    />
  );
}

export default WalletExport;
