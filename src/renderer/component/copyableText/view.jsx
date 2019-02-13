// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { clipboard } from 'electron';
import { FormField } from 'component/common/form';
import Button from 'component/button';

type Props = {
  copyable: string,
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
};

export default class CopyableText extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { copyable, doToast, snackMessage } = this.props;

    return (
      <FormField
        type="text"
        className="form-field--copyable"
        readOnly
        value={copyable || ''}
        ref={input => {
          this.input = input;
        }}
        onFocus={() => {
          if (this.input) {
            this.input.select();
          }
        }}
        inputButton={
          <Button
            button="primary"
            icon={ICONS.CLIPBOARD}
            onClick={() => {
              clipboard.writeText(copyable);
              doToast({
                message: snackMessage || __('Text copied'),
              });
            }}
          />
        }
      />
    );
  }
}
