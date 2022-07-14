// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import Card from 'component/common/card';
import Lbry from 'lbry';
import fs from 'fs';
import { clipboard } from 'electron';
import * as ICONS from 'constants/icons';
import * as remote from '@electron/remote';

type Props = {
  onDone: () => void,
  toast: (string, boolean) => void,
};

function WalletExport(props: Props) {
  const { onDone, toast } = props;

  const [password, setPassword] = React.useState();
  const [data, setData] = React.useState();
  const [fetching, setFetching] = React.useState();
  const getData = async (password) => {
    setFetching(true);
    const data = await Lbry.sync_apply({ password });
    setFetching(false);
    setData(data);
  };

  const handleSaveFile = () => {
    let defaultPath;
    let isWin = process.platform === 'win32';

    if (isWin === true) {
      defaultPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    }

    remote.dialog
      .showSaveDialog({
        title: 'Select File Path',
        defaultPath,
        buttonLabel: 'Save',
        filters: [
          {
            name: 'JSON Files',
            extensions: ['json'],
          },
        ],
      })
      .then((file) => {
        if (!file.canceled) {
          fs.writeFile(file.filePath.toString(), JSON.stringify(data), function (err) {
            if (err) throw err;
            toast(__('Sync data saved.'), false);
            onDone();
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast(__('Data could not be saved'), true);
      });
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
                <Button button={'primary'} onClick={handleSaveFile} label={'Save Data'} icon={ICONS.DOWNLOAD} />
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
