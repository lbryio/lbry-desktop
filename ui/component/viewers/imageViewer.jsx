// @flow
import React from 'react';
import loadImage from 'blueimp-load-image';

type Props = {
  source: string,
};

function loadPic(source) {
  loadImage(
    source,
    function(img, data) {
      if (img.type === 'error') {
        console.error('Cannot load image');
      } else {
        document.getElementsByClassName('file-render__viewer')[0].appendChild(img);
      }
    },
    {
      orientation: true,
    }
  );
}

function ImageViewer(props: Props) {
  const { source } = props;
  return <div className="file-render__viewer">{loadPic(source)}</div>;
}

export default ImageViewer;
