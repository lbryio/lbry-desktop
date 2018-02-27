// @flow
import * as React from "react";
import { FormRow, FormField } from 'component/common/form';
import Button from 'component/link';

type Props = {
  licenseType: string,
  copyrightNotice: ?string,
  licenseUrl: ?string,
  otherLicenseDescription: ?string,
  handleLicenseChange: (string, string) => void,
  handleLicenseDescriptionChange: (SyntheticInputEvent<*>) => void,
  handleLicenseUrlChange: (SyntheticInputEvent<*>) => void,
  handleCopyrightNoticeChange: (SyntheticInputEvent<*>) => void,
}

class LiscenseType extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).handleLicenseOnChange = this.handleLicenseOnChange.bind(this);
  }

  handleLicenseOnChange(event: SyntheticInputEvent<*>) {
    const { handleLicenseChange } = this.props;
    // $FlowFixMe
    const { options, selectedIndex } = event.target;

    const selectedOption = options[selectedIndex];
    const licenseType = selectedOption.value;
    const licenseUrl = selectedOption.getAttribute("data-url");

    handleLicenseChange(licenseType, licenseUrl);
  }

  render() {
    const {
      licenseType,
      otherLicenseDescription,
      licenseUrl,
      copyrightNotice,
      handleLicenseChange,
      handleLicenseDescriptionChange,
      handleLicenseUrlChange,
      handleCopyrightNoticeChange,
     } = this.props;

    const ccBy = __('Creative Commons Attribution 4.0 International');
    const ccBySa = __('Creative Commons Attribution-ShareAlike 4.0 International');
    const ccByNd = __('Creative Commons Attribution-NoDerivatives 4.0 International');
    const ccByNc = __('Creative Commons Attribution-NonCommercial 4.0 International');
    const ccByNcSa = __('Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International');
    const ccByNcNd = __('Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International');

    return (
      <div className="card__content">
        <FormField
          label={__("License (Optional)")}
          type="select"
          value={licenseType}
          onChange={this.handleLicenseOnChange}
        >
          <option>{__('None')}</option>
          <option value="Public Domain">{__('Public Domain')}</option>
          <option
            value={ccBy}
            data-url="https://creativecommons.org/licenses/by/4.0/legalcode"
          >
            {ccBy}
          </option>
          <option
            value={ccBySa}
            data-url="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
          >
            {ccBySa}
          </option>
          <option
            value={ccByNd}
            data-url="https://creativecommons.org/licenses/by-nd/4.0/legalcode"
          >
            {ccByNd}
          </option>
          <option
            value={ccByNc}
            data-url="https://creativecommons.org/licenses/by-nc/4.0/legalcode"
          >
            {ccByNc}
          </option>
          <option
            value={ccByNcSa}
            data-url="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode"
          >
            {ccByNcSa}
          </option>
          <option
            value={ccByNcNd}
            data-url="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode"
          >
            {ccByNcNd}
          </option>
          <option value="copyright">{__('Copyrighted...')}</option>
          <option value="other">{__('Other...')}</option>
        </FormField>

        {licenseType === 'copyright' && (
          <FormRow padded>
            <FormField
              stretch
              label={__('Copyright notice')}
              type="text"
              name="copyright-notice"
              value={copyrightNotice}
              onChange={handleCopyrightNoticeChange}
              />
          </FormRow>
        )}

        {licenseType === 'other' && (
          <React.Fragment>
            <FormRow padded>
              <FormField
                label={__('License description')}
                type="text"
                name="other-license-description"
                value={otherLicenseDescription}
                onChange={handleLicenseDescriptionChange}
                />
            </FormRow>
            <FormRow padded>
              <FormField
                label={__('License URL')}
                type="text"
                name="other-license-url"
                value={licenseUrl}
                onChange={handleLicenseUrlChange}
                />
            </FormRow>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default LiscenseType;
