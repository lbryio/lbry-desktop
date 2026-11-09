import React from 'react';
import * as MODALS from 'constants/modal_types';

type Props = {
  openModal: (arg1: string, arg2: Record<any, any>) => void
};

function ZoomableImage(props: Props) {
  const { openModal, ...imgProps } = props;

  const onClick = () => {
    openModal(MODALS.VIEW_IMAGE, { src: imgProps.src, title: imgProps.title || imgProps.alt });
  };

  return <img className="img__zoomable" {...imgProps} onClick={onClick} />;
}

export default ZoomableImage;
