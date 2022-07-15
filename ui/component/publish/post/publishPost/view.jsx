// @flow
import React from 'react';
import PostEditor from 'component/postEditor';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import PublishName from 'component/publish/shared/publishName';
import classnames from 'classnames';

type Props = {
  uri: ?string,
  fileMimeType: ?string,
  disabled: boolean,
  setPrevFileText: (string) => void,
  // --- redux ---
  title: ?string,
  balance: number,
  doUpdatePublishForm: ({}) => void,
};

function PublishPost(props: Props) {
  const {
    uri,
    title,
    balance,
    fileMimeType,
    doUpdatePublishForm: updatePublishForm,
    disabled,
    setPrevFileText,
  } = props;

  function handleTitleChange(event) {
    updatePublishForm({ title: event.target.value });
  }

  return (
    <Card
      className={classnames({
        'card--disabled': disabled || balance === 0,
      })}
      actions={
        <div className="card--file">
          <React.Fragment>
            <FormField
              type="text"
              name="content_title"
              label={__('Title')}
              placeholder={__('Descriptive titles work best')}
              disabled={disabled}
              value={title}
              onChange={handleTitleChange}
              className="fieldset-group"
              max="200"
              autoFocus
              autoComplete="off"
            />
            <PublishName uri={uri} />
            <PostEditor
              label={__('Post --[noun, markdown post tab button]--')}
              uri={uri}
              disabled={disabled}
              fileMimeType={fileMimeType}
              setPrevFileText={setPrevFileText}
            />
          </React.Fragment>
        </div>
      }
    />
  );
}

export default PublishPost;
