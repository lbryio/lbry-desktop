// @flow
import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { buildURI } from 'lbry-redux';
import { formatBytes } from 'util/format-bytes';
import { areEqual, removeItem } from 'util/array';
import loadingIcon from '../../../static/img/white_loading.gif';
import darkLoadingIcon from '../../../static/img/dark_loading.gif';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  byOutpoint: any,
  primary: any,
  playing: any,
  currentTheme: string,
  stopDownload: (outpoint: string) => void,
  doContinueDownloading: (outpoint: string, force: boolean) => void,
  download: (uri: string) => void,
};

function DownloadProgress({ byOutpoint, primary, playing, currentTheme, stopDownload, doContinueDownloading }: Props) {
  const [isShow, setIsShow] = usePersistedState('download-progress', true);
  const [downloading, setDownloading] = usePersistedState('download-progress-downloading', []);
  const [cancelHash] = useState({});
  const [initDownloadingHash] = useState({});
  const [prevPlaying, setPrevPlaying] = useState({});
  const [prevPrimary, setPrevPrimary] = useState({});

  const handleCancel = (hash, value) => {
    cancelHash[hash] = value;
  };

  const handleStopDownload = (outpoint) => {
    const updated = [...downloading];
    removeItem(updated, outpoint);
    setDownloading(updated);
    stopDownload(outpoint);
  };

  const runningByOutpoint = {};
  const currentDownloading = [...downloading];

  for (const key in byOutpoint) {
    const item = byOutpoint[key];
    if (item && item.status === 'running') runningByOutpoint[item.outpoint] = item;
  }

  Object.keys(runningByOutpoint)
    .filter((outpoint) => downloading.indexOf(outpoint) === -1)
    .map((outpoint) => {
      if (primary.outpoint !== outpoint && playing.outpoint !== outpoint) {
        currentDownloading.push(outpoint);
      }
    });

  downloading
    .filter((outpoint) => (byOutpoint[outpoint] && byOutpoint[outpoint].status !== 'running') || !byOutpoint[outpoint])
    .map((outpoint) => {
      removeItem(currentDownloading, outpoint);
    });
  if (!areEqual(downloading, currentDownloading)) setDownloading(currentDownloading);

  if (currentDownloading.length === 0) return null;

  if (playing.outpoint !== prevPlaying.outpoint) {
    if (downloading.includes(prevPlaying.outpoint)) {
      setTimeout(() => {
        doContinueDownloading(prevPlaying.outpoint, true);
      }, 1000);
    }
    setPrevPlaying(playing);
  }

  if (primary.outpoint !== prevPrimary.outpoint) {
    if (downloading.includes(prevPrimary.outpoint)) {
      setTimeout(() => {
        doContinueDownloading(prevPrimary.outpoint, true);
      }, 1000);
    }
    setPrevPrimary(primary);
  }

  currentDownloading.map((outpoint) => {
    if (!initDownloadingHash[outpoint]) {
      initDownloadingHash[outpoint] = true;
      doContinueDownloading(outpoint, false);
    }
  });

  if (!isShow) {
    return (
      <>
        <Button
          iconSize={40}
          icon={ICONS.DOWNLOAD}
          className="download-progress__toggle-button"
          onClick={() => setIsShow(true)}
        >
          <div className="download-progress__current-downloading">
            <span className="notification__bubble">
              <span className="notification__count">{currentDownloading.length}</span>
            </span>
          </div>
        </Button>
      </>
    );
  }

  return (
    <div className="download-progress__header">
      <Button className="download-progress__top-close-button" onClick={() => setIsShow(false)}>
        <div />
      </Button>

      {currentDownloading.map((outpoint, index) => {
        const item = runningByOutpoint[outpoint];
        let releaseTime = '';
        let isPlaying = false;
        if (item.metadata && item.metadata.release_time) {
          releaseTime = new Date(parseInt(item.metadata.release_time) * 1000).toISOString().split('T')[0];
        }
        if (outpoint === primary.outpoint || outpoint === playing.outpoint) {
          isPlaying = true;
        }
        return (
          <div key={item.outpoint}>
            {index !== 0 && <hr className="download-progress__divider" />}
            <DownloadProgressItem
              fileName={item.suggested_file_name}
              title={item.metadata.title}
              releaseTime={releaseTime}
              writtenBytes={item.written_bytes}
              totalBytes={item.total_bytes}
              addedOn={item.added_on}
              directory={item.download_directory}
              stopDownload={handleStopDownload}
              outpoint={item.outpoint}
              isCancel={cancelHash[item.outpoint]}
              claimID={item.claim_id}
              playing={isPlaying}
              claimName={item.claim_name}
              handleCancel={handleCancel}
              currentTheme={currentTheme}
            />
          </div>
        );
      })}
    </div>
  );
}

type DownloadProgressItemProps = {
  fileName: string,
  writtenBytes: number,
  totalBytes: number,
  addedOn: number,
  title: string,
  releaseTime: string,
  directory: string,
  outpoint: string,
  isCancel: boolean,
  claimID: string,
  claimName: string,
  playing: boolean,
  currentTheme: string,
  stopDownload: (outpoint: string) => void,
  handleCancel: (hash: string, value: boolean) => void,
};

function DownloadProgressItem({
  fileName,
  writtenBytes,
  totalBytes,
  addedOn,
  title,
  releaseTime,
  directory,
  outpoint,
  isCancel,
  claimID,
  claimName,
  playing,
  currentTheme,
  stopDownload,
  handleCancel,
}: DownloadProgressItemProps) {
  const processStopDownload = () => {
    handleCancel(outpoint, false);
    stopDownload(outpoint);
  };

  const [percent, setPercent] = useState(0);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    const updatePercent = ((writtenBytes / totalBytes) * 100).toFixed(0);
    setPercent(updatePercent);

    let updateText = '';
    const downloadSpeed = Math.ceil(writtenBytes / (Date.now() / 1000 - addedOn));
    const remainingSecond = Math.ceil((totalBytes - writtenBytes) / downloadSpeed);
    const remainingMinutes = Math.floor(remainingSecond / 60);

    if (remainingMinutes > 0) {
      updateText += __('%remainingMinutes% minutes %remainSecond% seconds remaining', {
        remainingMinutes: remainingMinutes,
        remainSecond: remainingSecond - 60 * remainingMinutes,
      });
    } else {
      updateText += __('%remainSecond% seconds remaining', { remainSecond: remainingSecond - 60 * remainingMinutes });
    }
    updateText += ' -- ';

    updateText += __('%written% of %total%', {
      written: formatBytes(writtenBytes),
      total: formatBytes(totalBytes),
    });
    updateText += ' ';

    updateText += __('(%speed%/sec)', {
      speed: formatBytes(downloadSpeed),
    });

    setProgressText(updateText);
  }, [writtenBytes, totalBytes, addedOn]);

  const openDownloadFolder = () => {
    shell.openPath(directory);
  };
  return (
    <div className="download-progress__state-container">
      <div className="download-progress__state-bar">
        <Button
          label={title}
          className="download-progress__state-filename"
          navigate={buildURI({ claimName, claimID })}
        />
        {playing ? (
          currentTheme === 'light' ? (
            <img src={loadingIcon} className="download-progress__playing-button" />
          ) : (
            <img src={darkLoadingIcon} className="download-progress__playing-button" />
          )
        ) : (
          <div
            className="download-progress__close-button"
            onClick={() => {
              handleCancel(outpoint, true);
            }}
          >
            &times;
          </div>
        )}
      </div>
      <div className="download-progress__state-bar">
        <a className="download-progress__state-filename-link" onClick={openDownloadFolder}>
          {fileName}
        </a>
        <p className="download-progress__release-time">{releaseTime}</p>
      </div>
      <div className="download-progress__state-bar">
        <div className="download-progress__bar-container">
          <div className="download-progress__bar-content" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <p className="download-progress__count-time">{progressText}</p>
      {isCancel && (
        <div className="download-progress__cancel">
          <p>{__('Do you cancel download this file?')}</p>
          <div className="download-progress__cancel-confirm">
            <Button label={__('Yes')} className="download-progress__cancel-ok" onClick={processStopDownload} />
            <Button
              label={__('No')}
              className="download-progress__cancel-ok"
              onClick={() => handleCancel(outpoint, false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DownloadProgress;
