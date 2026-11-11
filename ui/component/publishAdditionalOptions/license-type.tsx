import * as React from "react";
import { FormField } from "component/common/form";
import { CC_LICENSES, LEGACY_CC_LICENSES, COPYRIGHT, OTHER, PUBLIC_DOMAIN, NONE } from "constants/licenses";

type Props = {
  licenseType: string | null | undefined;
  licenseUrl: string | null | undefined;
  otherLicenseDescription: string | null | undefined;
  handleLicenseChange: (arg1: string, arg2: string) => void;
  handleLicenseDescriptionChange: (arg1: React.ChangeEvent<any>) => void;
  handleLicenseUrlChange: (arg1: React.ChangeEvent<any>) => void;
};

class LicenseType extends React.PureComponent<Props> {
  constructor() {
    // @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();

    (this as any).handleLicenseOnChange = this.handleLicenseOnChange.bind(this);
  }

  handleLicenseOnChange(event: React.ChangeEvent<any>) {
    const { handleLicenseChange } = this.props;
    const { options, selectedIndex } = event.target;
    const selectedOption = options[selectedIndex];
    const licenseType = selectedOption.value;
    const licenseUrl = selectedOption.getAttribute("data-url");

    handleLicenseChange(licenseType, licenseUrl);
  }

  render() {
    const { licenseType, otherLicenseDescription, licenseUrl, handleLicenseDescriptionChange, handleLicenseUrlChange } =
      this.props;

    return (
      <React.Fragment>
        <FormField
          name="license"
          label={__("License (Optional)")}
          type="select"
          value={licenseType}
          onChange={this.handleLicenseOnChange}
        >
          <option value={NONE}>{__("None")}</option>
          <option value={PUBLIC_DOMAIN}>{__("Public Domain")}</option>
          {CC_LICENSES.map(({ value, url }) => (
            <option key={value} value={value} data-url={url}>
              {value}
            </option>
          ))}

          <option value={COPYRIGHT}>{__("Copyrighted...")}</option>
          <option value={OTHER}>{__("Other...")}</option>
          <option disabled>{__("Legacy Licences")}</option>
          {LEGACY_CC_LICENSES.map(({ value, url }) => (
            <option key={value} value={value} data-url={url}>
              {value}
            </option>
          ))}
        </FormField>

        {licenseType === COPYRIGHT && (
          <FormField
            label={__("Copyright notice")}
            type="text"
            name="copyright-notice"
            value={otherLicenseDescription}
            onChange={handleLicenseDescriptionChange}
          />
        )}

        {licenseType === OTHER && (
          <fieldset>
            <legend>{__("Provide a description and link to your license")}</legend>
            {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
            <fieldset-group>
              <FormField
                label={__("License description")}
                placeholder={__("The 'cool' license - TM")}
                type="text"
                name="other-license-description"
                value={otherLicenseDescription}
                onChange={handleLicenseDescriptionChange}
              />

              <FormField
                label={__("License URL")}
                placeholder={__("mywebsite.com/license")}
                type="text"
                name="other-license-url"
                value={licenseUrl}
                onChange={handleLicenseUrlChange}
              />
              {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
            </fieldset-group>
          </fieldset>
        )}
      </React.Fragment>
    );
  }
}

export default LicenseType;
