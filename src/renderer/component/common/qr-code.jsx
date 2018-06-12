// @flow
import React from 'react';
import QRCodeElement from 'qrcode.react';
import classnames from 'classnames';

type Props = {
  value: string,
  paddingRight?: boolean,
  paddingTop?: boolean,
  size?: number,
};

class QRCode extends React.Component<Props> {
  static defaultProps = {
    paddingRight: false,
    paddingTop: false,
    size: 128,
  };

  render() {
    const { value, paddingRight, paddingTop, size } = this.props;
    return (
      <div
        className={classnames('qr-code', {
          'qr-code--right-padding': paddingRight,
          'qr-code--top-padding': paddingTop,
        })}
      >
        <QRCodeElement value={value} size={size} />
      </div>
    );
  }
}

export default QRCode;
