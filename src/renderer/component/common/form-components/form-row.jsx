// @flow
// Used as a wrapper for FormField to produce inline form elements
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  centered?: boolean,
  children: React.Node,
  padded?: boolean,
  verticallyCentered?: boolean,
};

export class FormRow extends React.PureComponent<Props> {
  static defaultProps = {
    padded: false,
  };

  render() {
    const { centered, children, padded, verticallyCentered } = this.props;
    return (
      <div
        className={classnames('form-row', {
          'form-row--centered': centered,
          'form-row--padded': padded,
          'form-row--vertically-centered': verticallyCentered,
        })}
      >
        {children}
      </div>
    );
  }
}

export default FormRow;
