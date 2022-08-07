// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form-components/form-field';
import { Form } from 'component/common/form-components/form';
import { withRouter } from 'react-router-dom';
// $FlowFixMe cannot resolve ...
import image from 'static/img/yrblsec.svg';

const LIMITED = 'limited';
const NONE = 'none';

type Props = {
  signOut: () => void,
  setShareDataInternal: (boolean) => void,
  handleNextPage: () => void,
};

function PrivacyAgreement(props: Props) {
  const { setShareDataInternal, handleNextPage } = props;
  const [share, setShare] = useState(undefined); // preload

  function handleSubmit() {
    if (share === LIMITED) {
      setShareDataInternal(true);
    } else {
      setShareDataInternal(false);
    }

    handleNextPage();
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
                name={'shareNot'}
                type="radio"
                checked={share === NONE}
                label={
                  <>
                    {__('No')} <span>😢</span>
                  </>
                }
                helper={__(
                  `* Note that as peer-to-peer software, your IP address and potentially other system information can be sent to other users, though this information is not stored permanently.`
                )}
                onChange={(e) => setShare(NONE)}
              />
            </fieldset>
            <div className={'card__actions'}>
              <Button button="primary" label={__(`Next`)} disabled={!share} type="submit" />
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
