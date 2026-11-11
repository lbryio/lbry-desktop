import React from "react";
import Button from "component/button";
import * as ICONS from "constants/icons";
type Props = {
  collectionIndex?: number;
  editCollection: (arg1: string, arg2: CollectionEditParams) => void;
  listId?: string;
  lastCollectionIndex?: number;
  claim: Claim | null | undefined;
};

function CollectionButtons(props: Props) {
  const { collectionIndex, editCollection, listId, lastCollectionIndex, claim } = props;
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <div className="collection-preview__edit-buttons">
      <div className="collection-preview__edit-group">
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={"button-collection-manage top-left"}
          icon={ICONS.UP_TOP}
          disabled={collectionIndex === 0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (editCollection) {
              editCollection(listId, {
                order: { from: collectionIndex, to: 0 },
              });
            }
          }}
        />
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={"button-collection-manage bottom-left"}
          icon={ICONS.DOWN_BOTTOM}
          disabled={collectionIndex === lastCollectionIndex}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (editCollection) {
              editCollection(listId, {
                order: { from: collectionIndex, to: lastCollectionIndex },
              });
            }
          }}
        />
      </div>
      <div className="collection-preview__edit-group">
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={"button-collection-manage"}
          disabled={collectionIndex === 0}
          icon={ICONS.UP}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (editCollection) {
              editCollection(listId, {
                order: { from: collectionIndex, to: Number(collectionIndex) - 1 },
              });
            }
          }}
        />
        <Button
          // @ts-expect-error - TS2322 (ts-migration)
          className={"button-collection-manage"}
          icon={ICONS.DOWN}
          disabled={collectionIndex === lastCollectionIndex}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (editCollection) {
              editCollection(listId, {
                order: { from: collectionIndex, to: Number(collectionIndex + 1) },
              });
            }
          }}
        />
      </div>
      {!confirmDelete && (
        <div className="collection-preview__edit-group collection-preview__delete ">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            className={"button-collection-manage button-collection-delete top-right bottom-right"}
            icon={ICONS.DELETE}
            onClick={(e) => {
              setConfirmDelete(true);
            }}
          />
        </div>
      )}
      {confirmDelete && (
        <div className="collection-preview__edit-group collection-preview__delete">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            className={"button-collection-manage button-collection-delete-cancel top-right"}
            icon={ICONS.REMOVE}
            onClick={(e) => {
              setConfirmDelete(false);
            }}
          />
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            className={"button-collection-manage button-collection-delete-confirm bottom-right"}
            icon={ICONS.DELETE}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (editCollection)
                // @ts-expect-error - TS2345 - Argument of type '{ claims: Claim[]; remove: true; }' is not assignable to parameter of type 'CollectionEditParams'.
                editCollection(listId, { claims: [claim], remove: true });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CollectionButtons;
