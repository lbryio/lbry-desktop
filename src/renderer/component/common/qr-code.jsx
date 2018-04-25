// @flow
import React from 'react';
import QRCodeElement from 'qrcode.react';
import classnames from 'classnames';

type Props = {
  value: string,
  paddingRight?: boolean,
};

class QRCode extends React.Component<Props> {
  static defaultProps = {
    paddingRight: false,
  };

  render() {
    const { value, paddingRight } = this.props;
    return (
      <div
        className={classnames('qr-code', {
          'qr-code--right-padding': paddingRight,
        })}
      >
        <QRCodeElement value={value} />
      </div>
    );
  }
}

export default QRCode;
