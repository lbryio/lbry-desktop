// @flow
import React, { Fragment } from 'react';
import Native from 'native';
import Button from 'component/button';
import SuggestedSubscriptions from 'component/subscribeSuggested';

type Props = {
  showSuggested: boolean,
  loadingSuggested: boolean,
  numberOfSubscriptions: number,
  onFinish: () => void,
  doShowSuggestedSubs: () => void,
};

export default (props: Props) => {
  const {
    showSuggested,
    loadingSuggested,
    numberOfSubscriptions,
    doShowSuggestedSubs,
    onFinish,
  } = props;

  return (
    <Fragment>
      <div className="yrbl-wrap">
        <img
          alt="Friendly gerbil"
          className="subscriptions__gerbil"
          src={Native.imagePath('gerbil-happy.png')}
        />
        <div className="card__content">
          <h2 className="card__title">
            {numberOfSubscriptions > 0 ? __('Woohoo!') : __('No subscriptions... yet.')}
          </h2>
          <p className="card__subtitle">
            {showSuggested
              ? __('I hear these channels are pretty good.')
              : __("I'll tell you where the good channels are if you find me a wheel.")}
          </p>
          {!showSuggested && (
            <div className="card__actions">
              <Button button="primary" label={__('Explore')} onClick={doShowSuggestedSubs} />
            </div>
          )}
          {showSuggested &&
            numberOfSubscriptions > 0 && (
              <div className="card__actions">
                <Button
                  button="primary"
                  onClick={onFinish}
                  label={`${__('View your')} ${numberOfSubscriptions} ${
                    numberOfSubscriptions > 1 ? __('subscribed channels') : __('subscribed channel')
                  }`}
                />
              </div>
            )}
        </div>
      </div>
      {showSuggested && !loadingSuggested && <SuggestedSubscriptions />}
    </Fragment>
  );
};
