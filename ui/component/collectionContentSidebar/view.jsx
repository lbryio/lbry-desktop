// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { COLLECTIONS_CONSTS } from 'lbry-redux';

type Props = {
  id: string,
  url: string,
  isMine: boolean,
  collectionUrls: Array<Claim>,
  collectionName: string,
  collection: any,
  createUnpublishedCollection: (string, Array<any>, ?string) => void,
};

export default function CollectionContent(props: Props) {
  const { collectionUrls, collectionName, id, url } = props;
  return (
    <Card
      isBodyList
      className="file-page__recommended"
      title={
        <span>
          <Icon
            icon={(id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
              (id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) || ICONS.STACK}
            className="icon--margin-right" />
          {collectionName}
        </span>
      }
      titleActions={
        <>
          {/* TODO: BUTTON TO SAVE COLLECTION - Probably save/copy modal */}
          <Button label={'View List'} button="link" navigate={`/$/${PAGES.LIST}/${id}`} />
        </>
      }
      body={
        <ClaimList
          isCardBody
          type="small"
          activeUri={url}
          uris={collectionUrls}
          collectionId={id}
          empty={__('List is Empty')}
        />
      }
    />
  );
}
