// @flow
import React from 'react';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import ZoomableImage from 'component/zoomableImage';

type Props = {
  source: string,
};

function ImageViewer(props: Props) {
  const { source } = props;
  const [loadingError, setLoadingError] = React.useState(false);

  return (
    <React.Fragment>
      {loadingError && (
        <Card
          title={__('Error displaying image')}
          actions={<ErrorText>There was an error displaying the image. You may still download it.</ErrorText>}
        />
      )}
      {!loadingError && (
        <div className="file-viewer">
          <ZoomableImage src={source} onError={() => setLoadingError(true)} />
        </div>
      )}
    </React.Fragment>
  );
}

export default ImageViewer;
