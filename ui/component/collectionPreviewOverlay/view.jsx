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
  fetchCollectionItems: (string) => void,
};

function CollectionPreviewOverlay(props: Props) {
  const { collectionId, collectionItemUrls, fetchCollectionItems } = props;

  React.useEffect(() => {
    if (!collectionItemUrls) {
      fetchCollectionItems(collectionId);
    }
  }, [collectionId, collectionItemUrls, fetchCollectionItems]);

  if (collectionItemUrls && collectionItemUrls.length > 0) {
    const displayed = collectionItemUrls.slice(0, 2);

    return (
      <div className="collection-preview__overlay-thumbs">
        <div className="collection-preview__overlay-side" />
        <div className="collection-preview__overlay-grid">
          {displayed.map((uri) => (
            <div className="collection-preview__overlay-grid-items" key={uri}>
              <FileThumbnail uri={uri} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default withRouter(CollectionPreviewOverlay);
