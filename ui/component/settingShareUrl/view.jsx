// @flow
import { SHARE_DOMAIN_URL, URL } from 'config';
import React from 'react';
import { FormField } from 'component/common/form';

const DEBOUNCE_TEXT_INPUT_MS = 500;

type Props = {
  customShareUrlEnabled: boolean,
  customShareUrl: string,
  setCustomShareUrlEnabled: (boolean) => void,
  setCustomShareUrl: (string) => void,
};

function SettingShareUrl(props: Props) {
  const { customShareUrlEnabled, customShareUrl, setCustomShareUrlEnabled, setCustomShareUrl } = props;
  const [url, setUrl] = React.useState(customShareUrl);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (url !== customShareUrl) {
        setCustomShareUrl(url);
      }
    }, DEBOUNCE_TEXT_INPUT_MS);

    return () => clearTimeout(timer);
  }, [url, customShareUrl, customShareUrlEnabled, setCustomShareUrl]);

  return (
    <React.Fragment>
      <fieldset-section>
        <FormField
          type="radio"
          name="use_default_share_url"
          label={__('Default share url (%name%)', { name: SHARE_DOMAIN_URL || URL })}
          checked={!customShareUrlEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setCustomShareUrlEnabled(false);
            }
          }}
        />
        <FormField
          type="radio"
          name="use_custom_share_url"
          label={__('Custom share url')}
          checked={customShareUrlEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setCustomShareUrlEnabled(true);
            }
          }}
        />

        {customShareUrlEnabled && (
          <div className="section__body">
            <FormField
              type="text"
              placeholder="https://lbryshare.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
      </fieldset-section>
    </React.Fragment>
  );
}

export default SettingShareUrl;
