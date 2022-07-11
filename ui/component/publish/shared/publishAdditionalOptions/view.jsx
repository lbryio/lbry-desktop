// @flow
import React, { useState } from 'react';
import classnames from 'classnames';
// import usePersistedState from 'effects/use-persisted-state';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import PublishReleaseDate from '../publishReleaseDate';
import LicenseType from './license-type';
import Card from 'component/common/card';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import { sortLanguageMap } from 'util/default-languages';
import PublishBid from '../publishBid';
import PublishPrice from 'component/publish/shared/publishPrice';

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
  isLivestream?: Boolean,
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
    isLivestream,
    // user,
    // useLBRYUploader,
    // needsYTAuth,
    // accessToken,
    // fetchAccessToken,
  } = props;
  // const [hideSection, setHideSection] = usePersistedState('publish-advanced-options', true);
  const [hideSection, setHideSection] = useState(disabled);
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
            {!hideSection && !disabled && (
              <>
                <div className={classnames({ 'card--disabled': !name })}>
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
                {!isLivestream && (
                  <div className="publish-row">
                    <PublishPrice disabled={!name} />
                  </div>
                )}
                <div className="publish-row">
                  <PublishBid />
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
