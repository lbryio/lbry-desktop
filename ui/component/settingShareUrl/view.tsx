import {SHARE_DOMAIN_URL, URL} from 'config';
import React from 'react';
import { FormField } from 'component/common/form';

const DEBOUNCE_TEXT_INPUT_MS = 500;

type Props = {
  customShareUrlEnabled: boolean,
  customShareUrl: string,
  setCustomShareUrlEnabled: (arg1: boolean) => void,
  setCustomShareUrl: (arg1: string) => void
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
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
      <fieldset-section>
        <FormField
          type="radio"
          name="use_default_share_url"
          label={__('Default share url (%name%)', { name: SHARE_DOMAIN_URL || URL })}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; checked: boolean; onChange: (e: any) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
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
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; checked: boolean; onChange: (e: any) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          checked={customShareUrlEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              setCustomShareUrlEnabled(true);
            }
          }}
        />

        {customShareUrlEnabled && (
          <div className="section__body">
{ /* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ type: string; placeholder: string; value: string; onChange: (e: any) => void; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
            <FormField
              type="text"
              placeholder="https://lbryshare.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
      </fieldset-section>
    </React.Fragment>
  );
}

export default SettingShareUrl;
