// @flow
import React from 'react';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  hideReleaseVersion?: boolean,
  releaseVersion: string,
  releaseNotes: string,
};

const LastReleaseChanges = (props: Props) => {
  const { hideReleaseVersion, releaseVersion, releaseNotes } = props;

  const releaseVersionTitle = (
    <p>
      {!hideReleaseVersion &&
        __('A new version %release_tag% of LBRY is ready for you.', { release_tag: releaseVersion })}
    </p>
  );
  const seeReleaseNotes = (
    <p className="help">
      <I18nMessage
        tokens={{
          release_notes: (
            <Button button="link" label={__('release notes')} href="https://github.com/lbryio/lbry-desktop/releases" />
          ),
        }}
      >
        Want to know what has changed? See the %release_notes%.
      </I18nMessage>
    </p>
  );

  return (
    <div className="release__notes">
      {releaseVersionTitle}
      <p className="last-release-changes" dangerouslySetInnerHTML={{ __html: releaseNotes }} />
      {seeReleaseNotes}
    </div>
  );
};

export default LastReleaseChanges;
