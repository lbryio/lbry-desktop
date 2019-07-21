// @flow
import React from 'react';
import classnames from 'classnames';
import usePersistedState from 'util/use-persisted-state';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import LicenseType from './license-type';

type Props = {
  language: ?string,
  name: ?string,
  licenseType: ?string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishAdvanced(props: Props) {
  const { language, name, licenseType, otherLicenseDescription, licenseUrl, updatePublishForm } = props;
  const [hideSection, setHideSection] = usePersistedState('publish-advanced-options', true);

  function toggleHideSection() {
    setHideSection(!hideSection);
  }

  return (
    <section className="card card--section">
      {!hideSection && (
        <div className={classnames({ 'card--disabled': !name })}>
          <FormField
            label={__('Language')}
            type="select"
            name="content_language"
            value={language}
            onChange={event => updatePublishForm({ language: event.target.value })}
          >
            <option value="en">{__('English')}</option>
            <option value="zh">{__('Chinese')}</option>
            <option value="fr">{__('French')}</option>
            <option value="de">{__('German')}</option>
            <option value="jp">{__('Japanese')}</option>
            <option value="ru">{__('Russian')}</option>
            <option value="es">{__('Spanish')}</option>
            <option value="id">{__('Indonesian')}</option>
            <option value="it">{__('Italian')}</option>
            <option value="nl">{__('Dutch')}</option>
            <option value="tr">{__('Turkish')}</option>
            <option value="pl">{__('Polish')}</option>
            <option value="ms">{__('Malay')}</option>
            <option value="pt">{__('Portuguese')}</option>
            <option value="vi">{__('Vietnamese')}</option>
            <option value="th">{__('Thai')}</option>
            <option value="ar">{__('Arabic')}</option>
            <option value="cs">{__('Czech')}</option>
            <option value="hr">{__('Croatian')}</option>
            <option value="km">{__('Cambodian')}</option>
            <option value="ko">{__('Korean')}</option>
            <option value="no">{__('Norwegian')}</option>
            <option value="ro">{__('Romanian')}</option>
            <option value="hi">{__('Hindi')}</option>
            <option value="el">{__('Greek')}</option>
          </FormField>

          <LicenseType
            licenseType={licenseType}
            otherLicenseDescription={otherLicenseDescription}
            licenseUrl={licenseUrl}
            handleLicenseChange={(newLicenseType, newLicenseUrl) =>
              updatePublishForm({
                licenseType: newLicenseType,
                licenseUrl: newLicenseUrl,
              })
            }
            handleLicenseDescriptionChange={event =>
              updatePublishForm({
                otherLicenseDescription: event.target.value,
              })
            }
            handleLicenseUrlChange={event => updatePublishForm({ licenseUrl: event.target.value })}
          />
        </div>
      )}

      <div className="card__actions">
        <Button label={hideSection ? __('Additional Options') : __('Hide')} button="link" onClick={toggleHideSection} />
      </div>
    </section>
  );
}

export default PublishAdvanced;
