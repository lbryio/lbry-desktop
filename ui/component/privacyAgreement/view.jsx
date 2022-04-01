// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import { FormField } from 'component/common/form-components/form-field';
import { Form } from 'component/common/form-components/form';
import { withRouter } from 'react-router-dom';
// $FlowFixMe cannot resolve ...
import image from 'static/img/yrblsec.svg';

const LIMITED = 'limited';
const NONE = 'none';

type Props = {
  setWelcomeVersion: (number) => void,
  signOut: () => void,
  setShareDataInternal: (boolean) => void,
  setShareDataThirdParty: (boolean) => void,
  authenticated: boolean,
  authenticateIfSharingData: () => void,
  handleNextPage: () => void,
};

function PrivacyAgreement(props: Props) {
  const {
    setShareDataInternal,
    setShareDataThirdParty,
    authenticated,
    signOut,
    authenticateIfSharingData,
    handleNextPage,
  } = props;
  const [share, setShare] = useState(undefined); // preload

  function handleSubmit() {
    if (share === LIMITED) {
      setShareDataInternal(true);
      setShareDataThirdParty(false);
    } else {
      setShareDataInternal(false);
      setShareDataThirdParty(false);
    }

    if (share === LIMITED) {
      authenticateIfSharingData();
    }

    // setWelcomeVersion(WELCOME_VERSION);
    handleNextPage();
    // history.replace(`/`);
  }

  return (
    <section className="main--contained">
      <div className={'columns first-run__wrapper'}>
        <div className={'first-run__left'}>
          <div>
            <h1 className="section__title--large">{__('Privacy')}</h1>
            <h3 className="section__subtitle">
              {__(
                `LBRY takes privacy and choice seriously. Is it ok if we monitor performance and help creators track their views?`
              )}
            </h3>
          </div>
          <Form onSubmit={handleSubmit} className="section__body">
            <fieldset>
              <FormField
                name={'shareWithLBRY'}
                type="radio"
                checked={share === LIMITED}
                label={
                  <>
                    {__('Yes, share with LBRY')} <span>🙂</span>
                  </>
                }
                onChange={(e) => setShare(LIMITED)}
              />
              <FormField
                disabled={authenticated}
                name={'shareNot'}
                type="radio"
                checked={share === NONE}
                label={
                  <>
                    {__('No')} <span>😢</span>
                  </>
                }
                helper={__(`* Note that as
                peer-to-peer software, your IP address and potentially other system information can be sent to other
                users, though this information is not stored permanently.`)}
                onChange={(e) => setShare(NONE)}
              />
              {authenticated && (
                <div className="card--inline section--padded">
                  <p className="help--inline">
                    <I18nMessage
                      tokens={{
                        signout_button: <Button button="link" label={__('Sign Out')} onClick={signOut} />,
                      }}
                    >
                      You are signed in and sharing data with your cloud service provider. %signout_button%.
                    </I18nMessage>
                  </p>
                </div>
              )}
            </fieldset>
            <div className={'card__actions'}>
              <Button button="primary" label={__(`Let's go`)} disabled={!share} type="submit" />
            </div>
            {share === NONE && (
              <p className="help">
                {__(
                  'While we respect the desire for maximally private usage, please note that choosing this option hurts the ability for creators to understand how their content is performing.'
                )}
              </p>
            )}
          </Form>
        </div>
        <div className={'first-run__image-wrapper'}>
          <img src={image} className="privacy-img" />
        </div>
      </div>
    </section>
  );
}

export default withRouter(PrivacyAgreement);
