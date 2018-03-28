// @flow
import React from 'react';
import QRCodeElement from 'qrcode.react';

type Props = {
  value: string,
};

const QRCode = (props: Props) => {
  const { value } = props;
  return (
    <div className="qr-code">
      <QRCodeElement value={value} />
    </div>
  );
};

export default QRCode;
