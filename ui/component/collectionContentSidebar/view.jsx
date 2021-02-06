// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

type Props = {
  collectionUrls: Array<Claim>,
  collectionName: string,
  collection: any,
  createUnpublishedCollection: (string, Array<any>, ?string) => void,
  id: string,
  claim: Claim,
  isMine: boolean,
};

export default function CollectionContent(props: Props) {
  const { collectionUrls, collectionName, id } = props;

  return (
    <Card
      isBodyList
      className="file-page__recommended"
      title={
        <span>
          <Icon icon={ICONS.STACK} className="icon--margin-right" />
          {collectionName}
        </span>
      }
      titleActions={
        <>
          {/* TODO: BUTTON TO SAVE COLLECTION - Probably save/copy modal */}
          <Button label={'View List'} button="link" navigate={`/$/${PAGES.LIST}/${id}`} />
        </>
      }
      body={<ClaimList isCardBody type="small" uris={collectionUrls} collectionId={id} empty={__('List is Empty')} />}
    />
  );
}
