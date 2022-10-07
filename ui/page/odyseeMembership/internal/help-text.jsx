// @flow
import React from 'react';

const HelpText = () => (
  <div className="section__subtitle">
    <p className="balance-text">
      {__(
        'First of all, thank you for considering or purchasing a membership, it means a ton to us! A few important details to know:'
      )}
    </p>
    <p>
      <ul>
        <li className="balance-text">
          {__(
            'Exclusive and early access features include: recommended content, homepage customization, and the ability to post Odysee hyperlinks + images in comments. Account is also automatically eligible for Rewards. More to come later.'
          )}
        </li>
        <li className="balance-text">
          {__(
            'The yearly Premium+ membership has a discount compared to monthly, and Premium is only available yearly.'
          )}
        </li>
        <li className="balance-text">{__('These are limited time rates, so get in early!')}</li>
        <li>
          {__(
            'There may be higher tiers available in the future for creators and anyone else who wants to support us.'
          )}
        </li>
        <li>
          {__('Badges will be displayed on a single channel to start, with an option to add on two more later on.')}
        </li>
        <li>
          {__('Cannot upgrade or downgrade a membership at this time. Refunds are not available. Choose wisely.')}
        </li>
      </ul>
    </p>
  </div>
);

export default HelpText;
