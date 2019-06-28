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
  label?: string,
};

export default class CopyableText extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = React.createRef();
    (this: any).onFocus = this.onFocus.bind(this);
  }

  input: { current: React.ElementRef<any> };

  onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = this.input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
    }
  }

  render() {
    const { copyable, doToast, snackMessage, label } = this.props;

    return (
      <FormField
        type="text"
        className="form-field--copyable"
        readOnly
        label={label}
        value={copyable || ''}
        ref={this.input}
        onFocus={this.onFocus}
        inputButton={
          <Button
            button="inverse"
            icon={ICONS.COPY}
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
