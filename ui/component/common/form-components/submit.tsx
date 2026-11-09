import * as React from 'react';
import Button from 'component/button';

type Props = {
  label: string,
  disabled: boolean
};

export class Submit extends React.PureComponent<Props> {
  static defaultProps = {
    label: 'Submit',
  };

  render() {
    const { label, disabled, ...otherProps } = this.props;
    // @ts-expect-error - TS2322 (ts-migration)
    return <Button button="primary" type="submit" label={label} disabled={disabled} {...otherProps} />;
  }
}

export default Submit;
