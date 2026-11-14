import React from "react";
import classnames from "classnames";
import ReactQrCode from "qrcode.react";

type Props = {
  value: string;
  paddingRight?: boolean;
  paddingTop?: boolean;
  // Width and height in pixels.
  size?: number;
};

class QRCode extends React.Component<Props> {
  static defaultProps = {
    paddingRight: false,
    paddingTop: false,
  };

  render() {
    const { value, paddingRight, paddingTop, size } = this.props;
    return (
      <div
        className={classnames("qr-code", {
          "qr-code--right-padding": paddingRight,
          "qr-code--top-padding": paddingTop,
        })}
      >
        <ReactQrCode value={value} size={size} />
      </div>
    );
  }
}

export default QRCode;
