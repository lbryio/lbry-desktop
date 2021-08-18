// @flow
import { COMMENT_SERVER_NAME } from 'config';
import React from 'react';
import Comments from 'comments';
import { FormField } from 'component/common/form';

const DEBOUNCE_TEXT_INPUT_MS = 500;

type Props = {
  customServerEnabled: boolean,
  customServerUrl: string,
  setCustomServerEnabled: (boolean) => void,
  setCustomServerUrl: (string) => void,
};

function SettingCommentsServer(props: Props) {
  const { customServerEnabled, customServerUrl, setCustomServerEnabled, setCustomServerUrl } = props;
  const [customUrl, setCustomUrl] = React.useState(customServerUrl);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCustomServerUrl(customUrl);
      Comments.url = customUrl;
    }, DEBOUNCE_TEXT_INPUT_MS);

    return () => clearTimeout(timer);
  }, [customUrl, setCustomServerUrl]);

  return (
    <React.Fragment>
      <fieldset-section>
        <FormField
          type="radio"
          name="use_default_comments_server"
          label={__('Default comments server (%name%)', { name: COMMENT_SERVER_NAME })}
          checked={!customServerEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setCustomServerEnabled(false);
            }
          }}
        />
        <FormField
          type="radio"
          name="use_custom_comments_server"
          label={__('Custom comments server')}
          checked={customServerEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setCustomServerEnabled(true);
            }
          }}
        />

        {customServerEnabled && (
          <div className="section__body">
            <FormField
              type="text"
              placeholder="https://comment.mysite.com"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
        )}
      </fieldset-section>
    </React.Fragment>
  );
}

export default SettingCommentsServer;
