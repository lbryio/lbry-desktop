// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import { withRouter } from 'react-router';

type Props = {
  enablePublishPreview: boolean,
  setEnablePublishPreview: boolean => void,
};

function PublishSettings(props: Props) {
  const { enablePublishPreview, setEnablePublishPreview } = props;

  function handleChange() {
    setEnablePublishPreview(!enablePublishPreview);
  }

  return (
    <div>
      <FormField
        type="checkbox"
        name="sync_toggle"
        label={__('Skip preview and confirmation')}
        checked={!enablePublishPreview}
        onChange={handleChange}
      />
    </div>
  );
}

export default withRouter(PublishSettings);
