// @flow
import * as React from 'react';
import Button from 'component/link';

type Props = {
  label: string,
  disabled: boolean,
};

export class Submit extends React.PureComponent<Props> {
  static defaultProps = {
    label: 'Submit',
  };

  render() {
    const { label, disabled } = this.props;
    return <Button type="submit" label={label} disabled={disabled} />;
  }
}

export default Submit;
