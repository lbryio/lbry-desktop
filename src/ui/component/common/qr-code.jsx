// @flow
import React from 'react';
import QRCodeElement from 'qrcode.react';
import classnames from 'classnames';

type Props = {
  value: string,
  paddingRight?: boolean,
  paddingTop?: boolean,
};

class QRCode extends React.Component<Props> {
  static defaultProps = {
    paddingRight: false,
    paddingTop: false,
  };

  render() {
    const { value, paddingRight, paddingTop } = this.props;
    return (
      <div
        className={classnames('qr-code', {
          'qr-code--right-padding': paddingRight,
          'qr-code--top-padding': paddingTop,
        })}
      >
        <QRCodeElement value={value} />
      </div>
    );
  }
}

export default QRCode;
