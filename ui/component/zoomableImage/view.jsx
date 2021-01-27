// @flow
import React from 'react';
import * as MODALS from 'constants/modal_types';

type Props = {
  openModal: (string, {}) => void,
};

function ZoomableImage(props: Props) {
  const { openModal, ...imgProps } = props;

  const onClick = () => {
    // $FlowFixMe
    openModal(MODALS.VIEW_IMAGE, { src: imgProps.src, title: imgProps.title || imgProps.alt });
  };

  return <img className="img__zoomable" {...imgProps} onClick={onClick} />;
}

export default ZoomableImage;
