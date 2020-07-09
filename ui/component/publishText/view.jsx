// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import Card from 'component/common/card';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';

type Props = {
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishText(props: Props) {
  const { description, updatePublishForm, disabled } = props;
  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-description-mode', false);

  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  return (
    <Card
      actions={
        <React.Fragment>
          <FormField
            type={advancedEditor ? 'markdown' : 'textarea'}
            name="content_description"
            label={__('Description')}
            placeholder={__('My description for this and that')}
            value={description}
            disabled={disabled}
            onChange={value => updatePublishForm({ description: advancedEditor ? value : value.target.value })}
            quickActionLabel={advancedEditor ? __('Simple Editor') : __('Advanced Editor')}
            quickActionHandler={toggleMarkdown}
            textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
          />
        </React.Fragment>
      }
    />
  );
}

export default PublishText;
