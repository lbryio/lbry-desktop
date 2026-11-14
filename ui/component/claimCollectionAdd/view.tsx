import React from "react";
import type { ElementRef } from "react";
import Button from "component/button";
import Card from "component/common/card";
import { FormField } from "component/common/form";
import * as ICONS from "constants/icons";
import * as KEYCODES from "constants/keycodes";
import CollectionSelectItem from "component/collectionSelectItem";

type Props = {
  claim: Claim;
  builtin: any;
  published: any;
  unpublished: any;
  addCollection: (arg1: string, arg2: Array<string>, arg3: string) => void;
  closeModal: () => void;
  uri: string;
};

const ClaimCollectionAdd = (props: Props) => {
  const { builtin, published, unpublished, addCollection, claim, closeModal, uri } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const permanentUrl = claim && claim.permanent_url;
  const isChannel = claim && claim.value_type === "channel";

  const [addNewCollection, setAddNewCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState("");

  // TODO: when other collection types added, filter list in context

  function handleNameInput(e: FormFieldChangeEvent) {
    const { value } = e.target;
    setNewCollectionName(value);
  }

  function handleAddCollection() {
    addCollection(newCollectionName, [permanentUrl], isChannel ? "collection" : "playlist");
    setNewCollectionName("");
    setAddNewCollection(false);
  }

  function altEnterListener(e: React.KeyboardEvent<any>) {
    if (e.keyCode === KEYCODES.ENTER) {
      e.preventDefault();
      // @ts-expect-error - TS2339 - Property 'current' does not exist on type 'unknown'.
      buttonref.current.click();
    }
  }

  function onTextareaFocus() {
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.addEventListener("keydown", altEnterListener);
  }

  function onTextareaBlur() {
    // @ts-expect-error - TS2769 - No overload matches this call.
    window.removeEventListener("keydown", altEnterListener);
  }

  function handleClearNew() {
    setNewCollectionName("");
    setAddNewCollection(false);
  }

  return (
    <Card
      title={__("Add To...")}
      actions={
        <div className="card__body">
          {uri && (
            // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
            <fieldset-section>
              <div className={"card__body-scrollable"}>
                {(Object.values(builtin) as any)
                  // $FlowFixMe
                  .filter((list) => (isChannel ? list.type === "collection" : list.type === "playlist"))
                  .map((l) => {
                    const { id } = l;
                    // @ts-expect-error - TS2322 (ts-migration)
                    return <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={"builtin"} />;
                  })}
                {unpublished &&
                  (Object.values(unpublished) as any)
                    // $FlowFixMe
                    .filter((list) => (isChannel ? list.type === "collection" : list.type === "playlist"))
                    .map((l) => {
                      const { id } = l;
                      return (
                        // @ts-expect-error - TS2322 (ts-migration)
                        <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={"unpublished"} />
                      );
                    })}
                {published &&
                  (Object.values(published) as any).map((l) => {
                    const { id } = l;
                    return (
                      // @ts-expect-error - TS2322 (ts-migration)
                      <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={"published"} />
                    );
                  })}
              </div>
              {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
            </fieldset-section>
          )}
          {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          <fieldset-section>
            {addNewCollection && (
              <FormField
                autoFocus
                type="text"
                name="new_collection"
                value={newCollectionName}
                label={__("New List Title")}
                // @ts-expect-error - TS2322 - Type '{ autoFocus: true; type: string; name: string; value: string; label: string; onFocus: () => void; onBlur: () => void; inputButton: Element; onChange: (e: FormFieldChangeEvent) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                inputButton={
                  <>
                    <Button
                      icon={ICONS.ADD}
                      className={"button-toggle"}
                      disabled={!newCollectionName.length}
                      onClick={() => handleAddCollection()}
                      // @ts-expect-error - TS2322 (ts-migration)
                      ref={buttonref}
                    />
                    {/* @ts-expect-error - TS2322 (ts-migration) */}
                    <Button className={"button-toggle"} icon={ICONS.REMOVE} onClick={() => handleClearNew()} />
                  </>
                }
                onChange={handleNameInput}
              />
            )}
            {!addNewCollection && (
              // @ts-expect-error - TS2322 (ts-migration)
              <Button button={"link"} label={__("New List")} onClick={() => setAddNewCollection(true)} />
            )}
            {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
          </fieldset-section>
          <div className="card__actions">
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="secondary" label={__("Done")} disabled={addNewCollection} onClick={closeModal} />
          </div>
        </div>
      }
    />
  );
};
export default ClaimCollectionAdd;
