// @flow
import React from 'react';
import ClaimDescription from 'component/claimDescription';
import ClaimAuthor from 'component/claimAuthor';
import CollectionPrivateIcon from 'component/common/collection-private-icon';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  // -- redux --
  uri?: string,
  collectionDescription?: string,
  collectionCount?: number,
  publishedCollectionCount?: number,
  collectionHasEdits: boolean,
};

const CollectionTitle = (props: Props) => {
  const { uri, collectionDescription, collectionCount, publishedCollectionCount, collectionHasEdits } = props;

  return (
    <div>
      {collectionCount || collectionCount === 0 ? (
        <span className="collection__subtitle">
          {collectionHasEdits
            ? __('Published count: %published_count%, edited count: %edited_count%', {
                published_count: publishedCollectionCount,
                edited_count: collectionCount,
              })
            : collectionCount === 1
            ? __('1 item')
            : __('%collectionCount% items', { collectionCount })}
        </span>
      ) : (
        <Skeleton variant="text" animation="wave" className="header__navigationItem--balanceLoading" />
      )}

      <ClaimDescription uri={uri} description={collectionDescription} />

      {uri ? <ClaimAuthor uri={uri} /> : <CollectionPrivateIcon />}
    </div>
  );
};

export default CollectionTitle;
