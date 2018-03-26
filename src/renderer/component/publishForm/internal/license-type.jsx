// @flow
import * as React from 'react';
import { FormRow, FormField } from 'component/common/form';
import { CC_LICENSES, COPYRIGHT, OTHER, PUBLIC_DOMAIN, NONE } from 'constants/licenses';

type Props = {
  licenseType: string,
  copyrightNotice: ?string,
  licenseUrl: ?string,
  otherLicenseDescription: ?string,
  handleLicenseChange: (string, string) => void,
  handleLicenseDescriptionChange: (SyntheticInputEvent<*>) => void,
  handleLicenseUrlChange: (SyntheticInputEvent<*>) => void,
  handleCopyrightNoticeChange: (SyntheticInputEvent<*>) => void,
};

class LicenseType extends React.PureComponent<Props> {
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
    const licenseUrl = selectedOption.getAttribute('data-url');

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

    return (
      <div className="card__content">
        <FormField
          label={__('License (Optional)')}
          type="select"
          value={licenseType}
          onChange={this.handleLicenseOnChange}
        >
          <option value={NONE}>{__('None')}</option>
          <option value={PUBLIC_DOMAIN}>{__('Public Domain')}</option>
          {CC_LICENSES.map(({ value, url }) => (
            <option key={value} value={value} data-url={url}>
              {value}
            </option>
          ))}

          <option value={COPYRIGHT}>{__('Copyrighted...')}</option>
          <option value={OTHER}>{__('Other...')}</option>
        </FormField>

        {licenseType === COPYRIGHT && (
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

        {licenseType === OTHER && (
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
    );
  }
}

export default LicenseType;
