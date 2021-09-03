// @flow
import React, { useState, useEffect } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  hideReleaseVersion?: boolean,
};

const LastReleaseChanges = (props: Props) => {
  const { hideReleaseVersion } = props;
  const [releaseTag, setReleaseTag] = useState('');
  const [releaseChanges, setReleaseChanges] = useState('');
  const [fetchingReleaseChanges, setFetchingReleaseChanges] = useState(false);
  const [fetchReleaseFailed, setFetchReleaseFailed] = useState(false);

  const releaseVersionTitle = (
    <p>
      {!hideReleaseVersion && __('A new version %release_tag% of LBRY is ready for you.', { release_tag: releaseTag })}
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

  useEffect(() => {
    const lastReleaseUrl = 'https://api.github.com/repos/lbryio/lbry-desktop/releases/latest';
    const options = {
      method: 'GET',
      headers: { Accept: 'application/vnd.github.v3+json' },
    };

    setFetchingReleaseChanges(true);
    fetch(lastReleaseUrl, options)
      .then((response) => response.json())
      .then((response) => {
        setReleaseTag(response.tag_name);
        setReleaseChanges(response.body);
        setFetchingReleaseChanges(false);
        setFetchReleaseFailed(false);
      })
      .catch(() => {
        setFetchingReleaseChanges(false);
        setFetchReleaseFailed(true);
      });
  }, []);

  if (fetchingReleaseChanges) {
    return <p>{__('Loading...')}</p>;
  }

  if (fetchReleaseFailed) {
    return (
      <div>
        {releaseVersionTitle}
        {seeReleaseNotes}
      </div>
    );
  }

  return (
    <div className="release__notes">
      {releaseVersionTitle}
      <p>
        <MarkdownPreview content={releaseChanges} />
      </p>
      {seeReleaseNotes}
    </div>
  );
};

export default LastReleaseChanges;
