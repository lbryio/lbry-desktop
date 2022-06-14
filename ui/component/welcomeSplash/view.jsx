// @flow
import React from 'react';
import Button from 'component/button';
import { withRouter } from 'react-router-dom';
import I18nMessage from 'component/i18nMessage';
// $FlowFixMe cannot resolve ...
import YrblHappy from 'static/img/yrblhappy.svg';

type Props = {
  setWelcomeVersion: (number) => void,
  setShareDataInternal: (boolean) => void,
  authenticated: boolean,
  handleNextPage: () => void,
  diskSpace?: DiskSpace,
};

function WelcomePage(props: Props) {
  const { handleNextPage } = props;

  return (
    <section className="main--contained">
      <div className={'columns first-run__wrapper'}>
        <div className={'first-run__left'}>
          <h1 className="section__title--large">{__('Welcome')}</h1>
          <h3 className="section__subtitle first-run__copy">
            {__(`You've entered the land of content freedom! Let's make sure everything is ship shape.`)}
          </h3>
        </div>
        <div className={'first-run__image-wrapper'}>
          <img src={YrblHappy} className="privacy-img" />
        </div>
      </div>
      <div className={'first-run__actions'}>
        <Button button="primary" label={__(`Next`)} onClick={handleNextPage} />
      </div>
      <p className="section__subtitle">
        <I18nMessage
          tokens={{
            terms: <Button button="link" href="https://www.lbry.com/termsofservice" label={__('Terms of Service')} />,
          }}
        >
          By continuing, you agree to the %terms%
        </I18nMessage>
      </p>
    </section>
  );
}

export default withRouter(WelcomePage);
