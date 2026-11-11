import React from "react";
import CollectionPreviewTile from "component/collectionPreviewTile";
import ClaimList from "component/claimList";
import Button from "component/button";
import * as COLLECTIONS_CONSTS from "constants/collections";
import Icon from "component/common/icon";
import * as ICONS from "constants/icons";
import * as PAGES from "constants/pages";
import * as KEYCODES from "constants/keycodes";

import Yrbl from "component/yrbl";
import classnames from "classnames";
import { FormField, Form } from "component/common/form";

type Props = {
  builtinCollections: CollectionGroup;
  publishedCollections: CollectionGroup;
  unpublishedCollections: CollectionGroup;
  // savedCollections: CollectionGroup,
  fetchingCollections: boolean;
};

const ALL = "All";
const PRIVATE = "Private";
const PUBLIC = "Public";
const COLLECTION_FILTERS = [ALL, PRIVATE, PUBLIC];
const COLLECTION_SHOW_COUNT = 12;

export default function CollectionsListMine(props: Props) {
  const {
    builtinCollections,
    publishedCollections,
    unpublishedCollections,
    // savedCollections, these are resolved on startup from sync'd claimIds or urls
    fetchingCollections,
  } = props;

  const builtinCollectionsList = Object.values(builtinCollections || {}) as any;
  const unpublishedCollectionsList = Object.keys(unpublishedCollections || {}) as any;
  const publishedList = Object.keys(publishedCollections || {}) as any;
  const hasCollections = unpublishedCollectionsList.length || publishedList.length;
  const [filterType, setFilterType] = React.useState(ALL);
  const [searchText, setSearchText] = React.useState("");

  const playlistPageUrl = `/$/${PAGES.PLAYLISTS}?type=${filterType}`;
  let collectionsToShow: unknown = [];
  if (filterType === ALL) {
    collectionsToShow = unpublishedCollectionsList.concat(publishedList);
  } else if (filterType === PRIVATE) {
    collectionsToShow = unpublishedCollectionsList;
  } else if (filterType === PUBLIC) {
    collectionsToShow = publishedList;
  }

  let filteredCollections;
  if (searchText && collectionsToShow) {
    filteredCollections = collectionsToShow
      // @ts-expect-error - TS2339 - Property 'filter' does not exist on type 'unknown'.
      .filter((id) => {
        return (
          (unpublishedCollections[id] &&
            unpublishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) ||
          (publishedCollections[id] &&
            publishedCollections[id].name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
        );
      })
      .slice(0, COLLECTION_SHOW_COUNT);
  } else {
    // @ts-expect-error - TS2339 - Property 'slice' does not exist on type 'unknown'.
    filteredCollections = collectionsToShow.slice(0, COLLECTION_SHOW_COUNT) || [];
  }

  // @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'.
  const totalLength = collectionsToShow ? collectionsToShow.length : 0;
  const filteredLength = filteredCollections.length;
  const isTruncated = totalLength > filteredLength;

  const watchLater = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.WATCH_LATER_ID);
  const favorites = builtinCollectionsList.find((list) => list.id === COLLECTIONS_CONSTS.FAVORITES_ID);
  const builtin = [watchLater, favorites];
  function escapeListener(e: React.KeyboardEvent<any>) {
    if (e.keyCode === KEYCODES.ESCAPE) {
      e.preventDefault();
      setSearchText("");
    }
  }

  function onTextareaFocus() {
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.addEventListener("keydown", escapeListener);
  }

  function onTextareaBlur() {
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.removeEventListener("keydown", escapeListener);
  }
  return (
    <>
      {builtin.map((list: Collection) => {
        const { items: itemUrls } = list;
        return (
          <React.Fragment key={list.name}>
            {Boolean(itemUrls && itemUrls.length) && (
              <div className="claim-grid__wrapper" key={list.name}>
                <h1 className="claim-grid__header">
                  <Button
                    // @ts-expect-error - TS2322 (ts-migration)
                    className="claim-grid__title"
                    button="link"
                    navigate={`/$/${PAGES.LIST}/${list.id}`}
                    label={
                      <span className="claim-grid__title-span">
                        {__(`${list.name}`)}
                        <div className="claim-grid__title--empty">
                          <Icon
                            className="icon--margin-right"
                            icon={
                              (list.id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
                              (list.id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
                              ICONS.STACK
                            }
                          />
                          {itemUrls.length}
                        </div>
                      </span>
                    }
                  />
                </h1>
                {/* @ts-expect-error - TS2740 (ts-migration) */}
                <ClaimList tileLayout key={list.name} uris={itemUrls.slice(0, 6)} collectionId={list.id} />
              </div>
            )}
          </React.Fragment>
        );
      })}
      <div className="claim-grid__wrapper">
        <div className="claim-grid__header section">
          <h1 className="claim-grid__title">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              className="claim-grid__title"
              button="link"
              navigate={playlistPageUrl}
              label={
                <span className="claim-grid__title-span">
                  {__("Playlists")}
                  <div className="claim-grid__title--empty">
                    <Icon className="icon--margin-right" icon={ICONS.STACK} />
                  </div>
                </span>
              }
            />
            {!hasCollections && !fetchingCollections && (
              <div className="claim-grid__title--empty">{__("(Empty) --[indicates empty playlist]--")}</div>
            )}
            {!hasCollections && fetchingCollections && (
              <div className="claim-grid__title--empty">{__("(Empty) --[indicates empty playlist]--")}</div>
            )}
          </h1>
        </div>
        <div className="section__header-action-stack">
          <div className="section__header--actions">
            <div className="claim-search__wrapper">
              <div className="claim-search__menu-group">
                {COLLECTION_FILTERS.map((value) => (
                  <Button
                    // @ts-expect-error - TS2322 (ts-migration)
                    label={__(value)}
                    key={value}
                    button="alt"
                    onClick={() => setFilterType(value)}
                    className={classnames("button-toggle", {
                      "button-toggle--active": filterType === value,
                    })}
                  />
                ))}
              </div>
            </div>
            {/* @ts-expect-error - TS2769 - No overload matches this call. */}
            <Form onSubmit={() => {}} className="wunderbar--inline">
              <Icon icon={ICONS.SEARCH} />
              <FormField
                // @ts-expect-error - TS2322 - Type '{ onFocus: () => void; onBlur: () => void; className: string; value: string; onChange: (e: any) => void; type: string; placeholder: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                className="wunderbar__input--inline"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder={__("Search")}
              />
            </Form>
          </div>
          <p className="collection-grid__results-summary">
            {isTruncated && (
              <>
                {__(`Showing %filtered% results of %total%`, {
                  filtered: filteredLength,
                  total: totalLength,
                })}
                {`${searchText ? " (" + __("filtered") + ") " : " "}`}
              </>
            )}
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="link"
              navigate={playlistPageUrl}
              label={<span className="claim-grid__title-span">{__("View All Playlists")}</span>}
            />
          </p>
        </div>
        {Boolean(hasCollections) && (
          <div>
            <div className="claim-grid">
              {filteredCollections &&
                filteredCollections.length > 0 &&
                // @ts-expect-error - TS2322 (ts-migration)
                filteredCollections.map((key) => <CollectionPreviewTile tileLayout collectionId={key} key={key} />)}
              {!filteredCollections.length && <div className="empty main--empty">{__("No matching playlists")}</div>}
            </div>
          </div>
        )}
        {!hasCollections && !fetchingCollections && (
          <div className="main--empty">
            <Yrbl type={"sad"} title={__("You have no lists yet. Better start hoarding!")} />
          </div>
        )}
        {!hasCollections && fetchingCollections && (
          <div className="main--empty">
            <h2 className="main--empty empty">{__("Loading...")}</h2>
          </div>
        )}
      </div>
    </>
  );
}
