// @flow
import React, { Fragment } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import ClaimTags from 'component/claimTags';

type Props = {
  uri: string,
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
  const { uri, description, email, website } = props;
  const showAbout = description || email || website;

  return (
    <section className="section">
      {!showAbout && <h2 className="main--empty empty">{__('Nothing here yet')}</h2>}
      {showAbout && (
        <Fragment>
          {description && (
            <div className="media__info-text media__info-text--constrained">
              <MarkdownPreview content={description} />
            </div>
          )}
          {email && (
            <Fragment>
              <label>{__('Contact')}</label>
              <div className="media__info-text">
                <MarkdownPreview content={formatEmail(email)} />
              </div>
            </Fragment>
          )}
          {website && (
            <Fragment>
              <label>{__('Site')}</label>
              <div className="media__info-text">
                <MarkdownPreview content={website} />
              </div>
            </Fragment>
          )}

          <label>{__('Tags')}</label>
          <div className="media__info-text">
            <ClaimTags uri={uri} type="large" />
          </div>
        </Fragment>
      )}
    </section>
  );
}

export default ChannelContent;
