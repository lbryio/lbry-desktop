// @flow
import React, { Suspense } from 'react';
import classnames from 'classnames';

const LazyQRCodeElement = React.lazy(() =>
  import(/* webpackChunkName: "qrCode" */
  'qrcode.react')
);

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
        <Suspense fallback={<div />}>
          <LazyQRCodeElement value={value} />
        </Suspense>
      </div>
    );
  }
}

export default QRCode;
