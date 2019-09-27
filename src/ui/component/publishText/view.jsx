// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';
import Card from 'component/common/card';

type Props = {
  title: ?string,
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishText(props: Props) {
  const { title, description, updatePublishForm, disabled } = props;
  const [advancedEditor, setAdvancedEditor] = usePersistedState('publish-form-description-mode', false);
  function toggleMarkdown() {
    setAdvancedEditor(!advancedEditor);
  }

  return (
    <Card
      actions={
        <React.Fragment>
          <FormField
            type="text"
            name="content_title"
            label={__('Title')}
            placeholder={__('Titular Title')}
            disabled={disabled}
            value={title}
            onChange={e => updatePublishForm({ title: e.target.value })}
          />

          <FormField
            type={advancedEditor ? 'markdown' : 'textarea'}
            name="content_description"
            label={__('Description')}
            placeholder={__('My description for this and that')}
            value={description}
            disabled={disabled}
            onChange={value => updatePublishForm({ description: advancedEditor ? value : value.target.value })}
          />
          <div className="card__actions">
            <Button
              button="link"
              onClick={toggleMarkdown}
              label={advancedEditor ? 'Simple Editor' : 'Advanced Editor'}
            />
          </div>
        </React.Fragment>
      }
    />
  );
}

export default PublishText;
