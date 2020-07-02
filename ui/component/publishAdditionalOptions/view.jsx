// @flow
import React from 'react';
import classnames from 'classnames';
import usePersistedState from 'effects/use-persisted-state';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import { LbryFirst } from 'lbry-redux';

import LicenseType from './license-type';
import Card from 'component/common/card';

type Props = {
  user: ?User,
  language: ?string,
  name: ?string,
  licenseType: ?string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
  useLBRYUploader: boolean,
  needsYTAuth: boolean,
  fetchAccessToken: () => void,
  accessToken: string,
};

function PublishAdditionalOptions(props: Props) {
  const {
    user,
    language,
    name,
    licenseType,
    otherLicenseDescription,
    licenseUrl,
    updatePublishForm,
    useLBRYUploader,
    needsYTAuth,
    fetchAccessToken,
    accessToken,
  } = props;
  const [hideSection, setHideSection] = usePersistedState('publish-advanced-options', true);
  const isLBRYFirstUser = user && user.lbry_first_approved;

  function toggleHideSection() {
    setHideSection(!hideSection);
  }
  function signup() {
    updatePublishForm({ ytSignupPending: true });
    LbryFirst.ytSignup()
      .then(response => {
        console.log(response);
        updatePublishForm({ needsYTAuth: false, ytSignupPending: false });
      })
      .catch(error => {
        updatePublishForm({ ytSignupPending: false });
        console.log(error);
      });
  }
  function unlink() {
    LbryFirst.remove()
      .then(response => {
        console.log(response);
        updatePublishForm({ needsYTAuth: true });
      })
      .catch(error => {
        console.log(error);
      });
  }

  React.useEffect(() => {
    if (!accessToken) {
      fetchAccessToken();
    }
  }, [accessToken, fetchAccessToken]);

  React.useEffect(() => {
    if (useLBRYUploader) {
      LbryFirst.hasYTAuth(accessToken)
        .then(response => {
          console.log(response);
          updatePublishForm({ needsYTAuth: !response.HasAuth });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [accessToken, updatePublishForm, useLBRYUploader]);

  return (
    <Card
      actions={
        <React.Fragment>
          {!hideSection && (
            <div className={classnames({ 'card--disabled': !name })}>
              {!IS_WEB && isLBRYFirstUser &&  (
                <FormField
                  type="checkbox"
                  name="use_lbry_uploader_checkbox"
                  onChange={event => updatePublishForm({ useLBRYUploader: !useLBRYUploader })}
                  label={
                    <React.Fragment>
                      {__('Automagically upload to your youtube channel!')}{' '}
                      <Button button="link" href="https://lbry.com/faq/lbry-uploader" label={__('Learn More')} />
                    </React.Fragment>
                  }
                />
              )}
              {!IS_WEB && useLBRYUploader && !needsYTAuth && isLBRYFirstUser && (
                <div className="card__actions">
                  <Button button="primary" onClick={unlink} label="Unlink YouTube Channel!" disabled={false} />
                </div>
              )}
              {!IS_WEB && useLBRYUploader && needsYTAuth && isLBRYFirstUser && (
                <div className="card__actions">
                  <Button button="primary" onClick={signup} label="Sign in with YouTube!" disabled={false} />
                </div>
              )}
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
                <option value="fi">{__('Finnish')}</option>
                <option value="kn">{__('Kannada')}</option>
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
                <option value="km">{__('Khmer')}</option>
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
