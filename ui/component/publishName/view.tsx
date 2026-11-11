import { DOMAIN } from "config";
import { INVALID_NAME_ERROR } from "constants/claim";
import React, { useState, useEffect } from "react";
import { isNameValid } from "util/lbryURI";
import { FormField } from "component/common/form";
import NameHelpText from "./name-help-text";

type Props = {
  name: string;
  uri: string;
  isStillEditing: boolean;
  myClaimForUri: StreamClaim | null | undefined;
  amountNeededForTakeover: number;
  prepareEdit: (arg1: Record<any, any>, arg2: string) => void;
  updatePublishForm: (arg1: Record<any, any>) => void;
  activeChannelClaim: ChannelClaim | null | undefined;
  incognito: boolean;
};

function PublishName(props: Props) {
  const { name, uri, isStillEditing, myClaimForUri, prepareEdit, updatePublishForm, activeChannelClaim, incognito } =
    props;
  const [nameError, setNameError] = useState(undefined);
  const [blurred, setBlurred] = React.useState(false);
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  let prefix = IS_WEB ? `${DOMAIN}/` : "lbry://";
  if (activeChannelName && !incognito) {
    prefix += `${activeChannelName}/`;
  }

  function editExistingClaim() {
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
    }
  }

  function handleNameChange(event: FormFieldChangeEvent) {
    updatePublishForm({ name: event.target.value });
  }

  useEffect(() => {
    if (!blurred && !name) {
      return;
    }

    let nameError;
    if (!name) {
      nameError = __("A name is required");
    } else if (!isNameValid(name)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name, blurred]);

  return (
    <>
      {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
      <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
        {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
        <fieldset-section>
          <label>{__("Name")}</label>
          <div className="form-field__prefix">{prefix}</div>
          {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
        </fieldset-section>
        <FormField
          type="text"
          name="content_name"
          value={name}
          error={nameError}
          disabled={isStillEditing}
          onChange={handleNameChange}
          // @ts-expect-error - TS2322 - Type '{ type: string; name: string; value: string; error: any; disabled: boolean; onChange: (event: FormFieldChangeEvent) => void; onBlur: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          onBlur={() => setBlurred(true)}
        />
        {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
      </fieldset-group>
      <div className="form-field__help">
        <NameHelpText
          uri={uri}
          isStillEditing={isStillEditing}
          myClaimForUri={myClaimForUri}
          onEditMyClaim={editExistingClaim}
        />
      </div>
    </>
  );
}

export default PublishName;
