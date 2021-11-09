// @flow
import { DOMAIN } from 'config';
import { INVALID_NAME_ERROR } from 'constants/claim';
import React, { useState, useEffect } from 'react';
import { isNameValid } from 'util/lbryURI';
import { FormField } from 'component/common/form';
import NameHelpText from './name-help-text';

type Props = {
  name: string,
  uri: string,
  isStillEditing: boolean,
  myClaimForUri: ?StreamClaim,
  amountNeededForTakeover: number,
  prepareEdit: ({}, string) => void,
  updatePublishForm: ({}) => void,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
};

function PublishName(props: Props) {
  const {
    name,
    uri,
    isStillEditing,
    myClaimForUri,
    prepareEdit,
    updatePublishForm,
    activeChannelClaim,
    incognito,
  } = props;
  const [nameError, setNameError] = useState(undefined);
  const [blurred, setBlurred] = React.useState(false);
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  let prefix = IS_WEB ? `${DOMAIN}/` : 'lbry://';
  if (activeChannelName && !incognito) {
    prefix += `${activeChannelName}/`;
  }

  function editExistingClaim() {
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
    }
  }

  function handleNameChange(event) {
    updatePublishForm({ name: event.target.value });
  }

  useEffect(() => {
    if (!blurred && !name) {
      return;
    }

    let nameError;
    if (!name) {
      nameError = __('A name is required');
    } else if (!isNameValid(name)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name, blurred]);

  return (
    <>
      <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
        <fieldset-section>
          <label>{__('Name')}</label>
          <div className="form-field__prefix">{prefix}</div>
        </fieldset-section>
        <FormField
          type="text"
          name="content_name"
          value={name}
          error={nameError}
          disabled={isStillEditing}
          onChange={handleNameChange}
          onBlur={() => setBlurred(true)}
        />
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
