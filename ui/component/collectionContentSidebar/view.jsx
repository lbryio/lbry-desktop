// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
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
  doOpenModal: (id: string, { collectionId: string }) => void,
};

export default function CollectionContent(props: Props) {
  const {
    collectionUrls,
    collectionName,
    id,
    url,
    doOpenModal,
  } = props;

  return (
    <Card
      isBodyList
      className="file-page__recommended"
      title={
        <>
          <span className="file-page__recommended-collection__row">
            <Icon
              icon={
                (id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
                (id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
                ICONS.STACK
              }
              className="icon--margin-right"
            />
            {collectionName}
          </span>
        </>
      }
      titleActions={
        <>
          <div className="card__title-actions--link">
            <Button label={'View List'} button="link" navigate={`/$/${PAGES.LIST}/${id}`} />
          </div>
          <span>
            <Button
              button="alt"
              title={__('Copy')}
              icon={ICONS.COPY}
              className="button--file-action--right"
              onClick={() => doOpenModal(MODALS.COLLECTION_ADD, { collectionId: id })}
            />
          </span>
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
