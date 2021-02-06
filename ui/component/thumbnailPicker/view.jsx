// @flow
import * as React from 'react';
import Card from 'component/common/card';
import ThumbnailMissingImage from './thumbnail-missing.png';
import SelectAsset from 'component/selectAsset';

type Props = {
  // uploadThumbnailStatus: string,
  thumbnailParam: string,
  thumbnailForUri: string,
  updateThumbnailParam: (string) => void,
  inline?: boolean,
};

const ThumbnailPicker = (props: Props) => {
  const { thumbnailForUri, thumbnailParam, updateThumbnailParam, inline } = props;

  // uploadThumbnailStatus
  //       {status === THUMBNAIL_STATUSES.API_DOWN || status === THUMBNAIL_STATUSES.MANUAL ? (
  //           {status === THUMBNAIL_STATUSES.READY && (
  //           {status === THUMBNAIL_STATUSES.COMPLETE && thumbnail && (
  const [thumbError, setThumbError] = React.useState(false); // possibly existing URL

  const updateThumb = (thumb: string) => {
    setThumbError(false);
    updateThumbnailParam(thumb);
  };
  if (inline) {
    return (
      <fieldset-section>
        <label>{__('Thumbnail')}</label>
        <div className="column">
          {thumbError && (
            <div
              className="column__item thumbnail-picker__preview"
              style={{ backgroundImage: `url(${ThumbnailMissingImage})` }}
            />
          )}
          {!thumbError && (
            <div
              className="column__item thumbnail-picker__preview"
              style={{ backgroundImage: `url(${thumbnailParam || thumbnailForUri})` }}
            >
              <img
                style={{ display: 'none' }}
                src={thumbnailParam || thumbnailForUri}
                alt={__('Thumbnail Preview')}
                onError={() => {
                  if (thumbnailParam) {
                    setThumbError(true);
                  }
                }}
              />
            </div>
          )}
          <div className="column__item">
            {/* if upload */}
            <SelectAsset
              inline
              onUpdate={updateThumb}
              currentValue={thumbnailParam}
              assetName={'Image'}
              recommended={'(16:9)'}
            />
          </div>
        </div>
      </fieldset-section>
    );
  }

  return (
    <div>
      <Card
        body={
          <div className="column">
            {thumbError && (
              <div
                className="column__item thumbnail-preview"
                style={{ backgroundImage: `url(${ThumbnailMissingImage})` }}
              />
            )}
            {!thumbError && (
              <div
                className="column__item thumbnail-preview"
                style={{ backgroundImage: `url(${thumbnailParam || thumbnailForUri})` }}
              >
                <img
                  style={{ display: 'none' }}
                  src={thumbnailParam || thumbnailForUri}
                  alt={__('Thumbnail Preview')}
                  onError={() => {
                    if (thumbnailParam) {
                      setThumbError(true);
                    }
                  }}
                />
              </div>
            )}
            <div className="column__item">
              {/* if upload */}
              <SelectAsset
                inline
                onUpdate={updateThumb}
                currentValue={thumbnailParam}
                assetName={'Thumbnail'}
                recommended={'(16:9)'}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ThumbnailPicker;
