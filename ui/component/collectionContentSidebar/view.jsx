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
  loop: boolean,
  shuffle: boolean,
  doToggleLoopList: (string, boolean) => void,
  doToggleShuffleList: (string, string, boolean) => void,
  createUnpublishedCollection: (string, Array<any>, ?string) => void,
};

export default function CollectionContent(props: Props) {
  const { collectionUrls, collectionName, id, url, loop, shuffle, doToggleLoopList, doToggleShuffleList } = props;

  return (
    <Card
      isBodyList
      className="file-page__recommended-collection"
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
          <span className="file-page__recommended-collection__row">
            <Button
              button="alt"
              title={__('Loop')}
              icon={ICONS.REPEAT}
              iconColor={loop && 'blue'}
              className="button--file-action"
              onClick={() => doToggleLoopList(id, !loop)}
            />
            <Button
              button="alt"
              title={__('Shuffle')}
              icon={ICONS.SHUFFLE}
              iconColor={shuffle && 'blue'}
              className="button--file-action"
              onClick={() => doToggleShuffleList(url, id, !shuffle)}
            />
          </span>
        </>
      }
      titleActions={
        <div className="card__title-actions--link">
          {/* TODO: BUTTON TO SAVE COLLECTION - Probably save/copy modal */}
          <Button label={__('View List')} button="link" navigate={`/$/${PAGES.LIST}/${id}`} />
        </div>
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
