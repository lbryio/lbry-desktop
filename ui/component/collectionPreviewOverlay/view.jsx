// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import FileThumbnail from 'component/fileThumbnail';

type Props = {
  uri: string,
  collectionId: string,
  collectionName: string,
  collectionCount: number,
  editedCollection?: Collection,
  pendingCollection?: Collection,
  claim: ?Claim,
  collectionItemUrls: Array<string>,
};

function CollectionPreviewTileOverlay(props: Props) {
  const { collectionItemUrls } = props;

  if (collectionItemUrls && collectionItemUrls.length > 0) {
    return (
      <div className="collection-preview__overlay-thumbs">
        <div className="collection-preview__overlay-side" />
        <div className="collection-preview__overlay-grid">
          {collectionItemUrls &&
            collectionItemUrls.map((item, index) => {
              if (index < 2) {
                return (
                  <div className="collection-preview__overlay-grid-items">
                    <FileThumbnail uri={item} key={item} />
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
  return null;
}

export default withRouter(CollectionPreviewTileOverlay);
