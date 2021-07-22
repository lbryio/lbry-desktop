// @flow
import * as React from 'react';
import Villain from 'villain-react';
import LoadingScreen from 'component/common/loading-screen';

// @if TARGET='web'
import useStream from 'effects/use-stream';
// @endif

// @if TARGET='app'
import useFileStream from 'effects/use-stream-file';
// @endif

// Import default styles for Villain
import 'villain-react/dist/style.css';

type Props = {
  source: {
    file: (?string) => any,
    stream: string,
  },
  theme: string,
};

let workerUrl = 'webworkers/worker-bundle.js';

if (process.env.NODE_ENV !== 'production') {
  // Don't add a leading slash in production because electron treats it as an absolute path
  workerUrl = `/${workerUrl}`;
}

const ComicBookViewer = (props: Props) => {
  const { source, theme } = props;
  let finalSource;

  // @if TARGET='web'
  finalSource = useStream(source.stream);
  // @endif

  // @if TARGET='app'
  finalSource = useFileStream(source.file);
  // @endif

  // Villain options
  const opts = {
    theme: theme === 'dark' ? 'Dark' : 'Light',
    allowFullScreen: true,
    autoHideControls: false,
    allowGlobalShortcuts: true,
  };

  const { error, loading, content } = finalSource;
  const ready = content !== null && !loading && !error;
  const errorMessage = __("Sorry, looks like we can't load the archive.");

  return (
    <div className="file-render__viewer  file-render__viewer--comic">
      {loading && <LoadingScreen status={__('Loading')} isDocument />}
      {ready && (
        <Villain source={finalSource.content} className={'comic-viewer'} options={opts} workerUrl={workerUrl} />
      )}
      {error && <LoadingScreen status={errorMessage} spinner={false} />}
    </div>
  );
};

export default ComicBookViewer;
