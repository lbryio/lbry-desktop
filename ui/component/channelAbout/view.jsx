// @flow
import React, { Fragment } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';

type Props = {
  description: ?string,
  email: ?string,
  website: ?string,
};

const formatEmail = (email: string) => {
  if (email) {
    const protocolRegex = new RegExp('^mailto:', 'i');
    const protocol = protocolRegex.exec(email);
    return protocol ? email : `mailto:${email}`;
  }
  return null;
};

function ChannelContent(props: Props) {
  const { description, email, website } = props;
  const showAbout = description || email || website;

  return (
    <section className="card--section">
      {!showAbout && <h2 className="main--empty empty">{__('Nothing here yet')}</h2>}
      {showAbout && (
        <Fragment>
          {description && (
            <div className="media__info-text media__info-text--small">
              <MarkdownPreview content={description} promptLinks />
            </div>
          )}
          {email && (
            <Fragment>
              <div className="media__info-title">{__('Contact')}</div>
              <div className="media__info-text">
                <MarkdownPreview content={formatEmail(email)} promptLinks />
              </div>
            </Fragment>
          )}
          {website && (
            <Fragment>
              <div className="media__info-title">{__('Site')}</div>
              <div className="media__info-text">
                <MarkdownPreview content={website} promptLinks />
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </section>
  );
}

export default ChannelContent;
