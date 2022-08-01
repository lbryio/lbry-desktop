// @flow
import React from 'react';
import CollectionItemsList from 'component/collectionItemsList';
import Page from 'component/page';
import * as PAGES from 'constants/pages';
import { COLLECTION_PAGE as CP } from 'constants/urlParams';
import { useHistory } from 'react-router-dom';
import CollectionPublish from './internal/collectionPublish';
import CollectionPrivateEdit from './internal/collectionPrivateEdit';
import CollectionHeader from './internal/collectionHeader';

type Props = {
  collectionId: string,
  uri: string,
  collection: Collection,
  collectionUrls: Array<string>,
  brokenUrls: ?Array<any>,
  isResolvingCollection: boolean,
  doFetchItemsInCollection: (params: { collectionId: string }, cb?: () => void) => void,
};

export default function CollectionPage(props: Props) {
  const {
    collectionId,
    uri,
    collection,
    collectionUrls,
    brokenUrls,
    isResolvingCollection,
    doFetchItemsInCollection,
  } = props;

  const {
    replace,
    location: { search, state },
  } = useHistory();
  const { showEdit: pageShowEdit } = state || {};

  const [showEdit, setShowEdit] = React.useState(pageShowEdit);
  const [unavailableUris, setUnavailable] = React.useState(brokenUrls || []);

  const { name, totalItems } = collection || {};

  const urlParams = new URLSearchParams(search);
  const publishing = urlParams.get(CP.QUERIES.VIEW) === CP.VIEWS.PUBLISH;
  const editing = urlParams.get(CP.QUERIES.VIEW) === CP.VIEWS.EDIT;
  const returnPath = urlParams.get('redirect');

  const editPage = editing || publishing;
  const urlsReady =
    collectionUrls && (totalItems === undefined || (totalItems && totalItems === collectionUrls.length));

  React.useEffect(() => {
    if (collectionId && !urlsReady && !collection) {
      doFetchItemsInCollection({ collectionId });
    }
  }, [collectionId, urlsReady, doFetchItemsInCollection, collection]);

  if (!collection && !isResolvingCollection) {
    return (
      <Page>
        <h2 className="main--empty empty">{__('Nothing here')}</h2>
      </Page>
    );
  }

  if (editPage) {
    const getReturnPath = (id) => returnPath || `/$/${PAGES.PLAYLIST}/${id || collectionId}`;
    const onDone = (id) => replace(getReturnPath(id));

    return (
      <Page
        noFooter
        noSideNavigation={editPage}
        backout={{
          title: __('%action% %collection%', {
            collection: name,
            action: uri || editing ? __('Editing') : __('Publishing'),
          }),
          simpleTitle: uri || editing ? __('Editing') : __('Publishing'),
          backNavDefault: getReturnPath(collectionId),
        }}
      >
        {editing ? (
          <CollectionPrivateEdit collectionId={collectionId} />
        ) : (
          <CollectionPublish uri={uri} collectionId={collectionId} onDone={onDone} />
        )}
      </Page>
    );
  }

  return (
    <Page className="playlists-page-wrapper">
      <div className="section card-stack">
        <CollectionHeader
          collectionId={collectionId}
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          unavailableUris={unavailableUris}
          setUnavailable={setUnavailable}
        />

        <CollectionItemsList
          collectionId={collectionId}
          showEdit={showEdit}
          unavailableUris={unavailableUris}
          showNullPlaceholder
        />
      </div>
    </Page>
  );
}
