// @flow
import React, { Fragment } from 'react';

type Props = {
  description: ?string,
  email: ?string,
  website: ?string,
};

function ChannelContent(props: Props) {
  const { description, email, website } = props;
  const showAbout = description || email || website;

  return (
    <section>
      {!showAbout && <h2 className="empty">{__('Nothing here yet')}</h2>}
      {showAbout && (
        <Fragment>
          {description && <div className="media__info-text">{description}</div>}
          {email && (
            <Fragment>
              <div className="media__info-title">{__('Contact')}</div>
              <div className="media__info-text">{email}</div>
            </Fragment>
          )}
          {website && (
            <Fragment>
              <div className="media__info-title">{__('Site')}</div>
              <div className="media__info-text">{website}</div>
            </Fragment>
          )}
        </Fragment>
      )}
    </section>
  );
}

export default ChannelContent;
