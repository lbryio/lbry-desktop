// @flow
import React from 'react';
import classnames from 'classnames';
import usePersistedState from 'effects/use-persisted-state';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import PublishReleaseDate from 'component/publishReleaseDate';
import LicenseType from './license-type';
import Card from 'component/common/card';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import { sortLanguageMap } from 'util/default-languages';

type Props = {
  language: ?string,
  name: ?string,
  licenseType: ?string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishAdditionalOptions(props: Props) {
  const { language, name, licenseType, otherLicenseDescription, licenseUrl, updatePublishForm } = props;
  const [hideSection, setHideSection] = usePersistedState('publish-advanced-options', true);

  function toggleHideSection() {
    setHideSection(!hideSection);
  }

  return (
    <Card
      className="card--enable-overflow"
      actions={
        <React.Fragment>
          {!hideSection && (
            <div className={classnames({ 'card--disabled': !name })}>
              <div className="section">
                <PublishReleaseDate />

                <FormField
                  label={__('Language')}
                  type="select"
                  name="content_language"
                  value={language}
                  onChange={(event) => updatePublishForm({ languages: [event.target.value] })}
                >
                  {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]) => (
                    <option key={langKey} value={langKey}>
                      {langName}
                    </option>
                  ))}
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
                  handleLicenseDescriptionChange={(event) =>
                    updatePublishForm({
                      otherLicenseDescription: event.target.value,
                    })
                  }
                  handleLicenseUrlChange={(event) => updatePublishForm({ licenseUrl: event.target.value })}
                />
              </div>
            </div>
          )}

          <div className="section__actions">
            <Button
              label={hideSection ? __('Additional Options') : __('Hide')}
              button="link"
              onClick={toggleHideSection}
            />
          </div>
        </React.Fragment>
      }
    />
  );
}

export default PublishAdditionalOptions;
