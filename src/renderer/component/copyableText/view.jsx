// @flow
import * as React from 'react';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  copyable: string,
  doToast: ({ message: string }) => void,
};

export default class CopyableText extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { copyable, doToast, noSnackbar } = this.props;

    return (
      <FormRow verticallyCentered padded stretch>
        <input
          className="input-copyable form-field__input"
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
        />

        <Button
          noPadding
          button="secondary"
          icon={icons.CLIPBOARD}
          onClick={() => {
            clipboard.writeText(copyable);
            doToast({
              message: __('Text copied'),
            });
          }}
        />
      </FormRow>
    );
  }
}
