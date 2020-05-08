// @flow
import * as React from 'react';
import Villain from 'villain-react';
import useFileStream from 'effects/use-stream-file'
import LoadingScreen from 'component/common/loading-screen';
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

const ComicBookViewer = ( props: Props) => {
    const { source, theme } = props
    const { stream, file } =  source

    // @if TARGET='app'
    const finalSource = useFileStream(file)
    // @endif

    // Villain options
    const opts = {
      theme: theme === 'dark' ? 'Dark' : 'Light',
      allowFullScreen: true,
      autoHideControls: false,
      allowGlobalShortcuts: true,
    };

    const errorMessage = __("Sorry, looks like we can't load the archive.");

    return (
      <div className="file-render__viewer  file-render__viewer--comic">
        { loading && <LoadingScreen status={__('Loading')} />}
        { ready && <Villain source={finalSource.content} className={'comic-viewer'} options={opts} workerUrl={workerUrl} /> }
        { error && <LoadingScreen status={errorMessage} spinner={false} /> }
      </div>
    );
  }

export default ComicBookViewer;
