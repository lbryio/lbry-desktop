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
import PublishBid from 'component/publishBid';

// @if TARGET='app'
// import ErrorText from 'component/common/error-text';
// import { LbryFirst } from 'lbry-redux';
// import { ipcRenderer } from 'electron';
// @endif

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
  showSchedulingOptions: boolean,
};

function PublishAdditionalOptions(props: Props) {
  const {
    language,
    name,
    licenseType,
    otherLicenseDescription,
    licenseUrl,
    updatePublishForm,
    showSchedulingOptions,
    disabled,
    // user,
    // useLBRYUploader,
    // needsYTAuth,
    // accessToken,
    // fetchAccessToken,
  } = props;
  const [hideSection, setHideSection] = usePersistedState('publish-advanced-options', true);
  //   const [hasLaunchedLbryFirst, setHasLaunchedLbryFirst] = React.useState(false);
  //   const [ytError, setYtError] = React.useState(false);
  //   const isLBRYFirstUser = user && user.lbry_first_approved;
  //   const showLbryFirstCheckbox = !IS_WEB && isLBRYFirstUser && hasLaunchedLbryFirst;

  function toggleHideSection() {
    setHideSection(!hideSection);
  }

  //   @if TARGET='app'
  //   function signup() {
  //     updatePublishForm({ ytSignupPending: true });
  //     LbryFirst.ytSignup()
  //       .then(response => {
  //         updatePublishForm({ needsYTAuth: false, ytSignupPending: false });
  //       })
  //       .catch(error => {
  //         updatePublishForm({ ytSignupPending: false });
  //         setYtError(true);
  //         console.error(error); // eslint-disable-line
  //       });
  //   }

  //   function unlink() {
  //     setYtError(false);

  //     LbryFirst.remove()
  //       .then(response => {
  //         updatePublishForm({ needsYTAuth: true });
  //       })
  //       .catch(error => {
  //         setYtError(true);
  //         console.error(error); // eslint-disable-line
  //       });
  //   }

  //   React.useEffect(() => {
  //     if (!accessToken) {
  //       fetchAccessToken();
  //     }
  //   }, [accessToken, fetchAccessToken]);

  //   React.useEffect(() => {
  //     if (isLBRYFirstUser && !hasLaunchedLbryFirst) {
  //       ipcRenderer.send('launch-lbry-first');
  //       ipcRenderer.on('lbry-first-launched', () => {
  //         setHasLaunchedLbryFirst(true);
  //       });
  //     }
  //   }, [isLBRYFirstUser, hasLaunchedLbryFirst, setHasLaunchedLbryFirst]);

  //   React.useEffect(() => {
  //     if (useLBRYUploader && isLBRYFirstUser && hasLaunchedLbryFirst && accessToken) {
  //       LbryFirst.hasYTAuth(accessToken)
  //         .then(response => {
  //           updatePublishForm({ needsYTAuth: !response.HasAuth });
  //         })
  //         .catch(error => {
  //           setYtError(true);
  //           console.error(error); // eslint-disable-line
  //         });
  //     }
  //   }, [updatePublishForm, useLBRYUploader, isLBRYFirstUser, hasLaunchedLbryFirst, accessToken]);
  // @endif

  return (
    <>
      <h2 className="card__title">{__('Additional Options')}</h2>
      <Card
        className="card--enable-overflow card--publish-section card--additional-options"
        actions={
          <React.Fragment>
            {!hideSection && (
              <>
                <div className="publish-row">
                  <PublishBid disabled={disabled} />
                </div>
                <div className={classnames({ 'card--disabled': !name })}>
                  {/* @if TARGET='app' */}
                  {/* {showLbryFirstCheckbox && (
                <div className="section">
                  <>
                    <FormField
                      checked={useLBRYUploader}
                      type="checkbox"
                      name="use_lbry_uploader_checkbox"
                      onChange={event => updatePublishForm({ useLBRYUploader: !useLBRYUploader })}
                      label={
                        <React.Fragment>
                          {__('Automagically upload to your youtube channel.')}{' '}
                          <Button button="link" href="https://lbry.com/faq/lbry-uploader" label={__('Learn More')} />
                        </React.Fragment>
                      }
                    />
                    {useLBRYUploader && (
                      <div className="section__actions">
                        {needsYTAuth ? (
                          <Button
                            button="primary"
                            onClick={signup}
                            label={__('Log In With YouTube')}
                            disabled={false}
                          />
                        ) : (
                          <Button button="alt" onClick={unlink} label={__('Unlink YouTube Channel')} disabled={false} />
                        )}
                        {ytError && <ErrorText>{__('There was an error with LBRY first publishing.')}</ErrorText>}
                      </div>
                    )}
                  </>
                </div>
              )} */}
                  {/* @endif */}
                  <div className="section">
                    <div className="publish-row">{!showSchedulingOptions && <PublishReleaseDate />}</div>

                    <div className="publish-row">
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
                    </div>

                    <div className="publish-row">
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
                </div>
              </>
            )}

            <div className="section__actions">
              <Button label={hideSection ? __('Show') : __('Hide')} button="link" onClick={toggleHideSection} />
            </div>
          </React.Fragment>
        }
      />
    </>
  );
}

export default PublishAdditionalOptions;
