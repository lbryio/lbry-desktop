// @flow
// Used as a wrapper for FormField to produce inline form elements
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  children: React.Node,
  padded?: boolean,
  verticallyCentered?: boolean,
  stretch?: boolean,
  alignRight?: boolean,
  centered?: boolean,
};

export class FormRow extends React.PureComponent<Props> {
  static defaultProps = {
    padded: false,
  };

  render() {
    const { children, padded, verticallyCentered, stretch, alignRight, centered } = this.props;
    return (
      <div
        className={classnames('form-row', {
          'form-row--padded': padded,
          'form-row--vertically-centered': verticallyCentered,
          'form-row--stretch': stretch,
          'form-row--right': alignRight,
          'form-row--centered': centered,
        })}
      >
        {children}
      </div>
    );
  }
}

export default FormRow;
