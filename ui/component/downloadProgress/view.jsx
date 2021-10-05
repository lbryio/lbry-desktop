// @flow
import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { buildURI } from 'lbry-redux';
import { formatBytes } from 'util/format-bytes';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  downloadList: any[],
  stopDownload: (outpoint: string) => void,
  updateDownloadingStatus: (outpoint: string) => void,
};

function DownloadProgress({ downloadList, stopDownload, updateDownloadingStatus }: Props) {
  const [isShow, setIsShow] = usePersistedState('download-progress', true);
  const [cancelHash] = useState({});
  const [checkDownloadingHash] = useState({});

  const handleCancel = (hash, value) => {
    cancelHash[hash] = value;
  };

  if (downloadList.length === 0) return null;

  downloadList.map((item) => {
    if (item && !checkDownloadingHash[item.outpoint]) {
      updateDownloadingStatus(item.outpoint);
      checkDownloadingHash[item.outpoint] = true;
    }
  });

  if (!isShow) {
    return (
      <Button
        iconSize={40}
        icon={ICONS.DOWNLOAD}
        className="download-progress__toggle-button"
        onClick={() => setIsShow(true)}
      />
    );
  }

  return (
    <div className="download-progress__header">
      <Button className="download-progress__top-close-button" onClick={() => setIsShow(false)}>
        <div />
      </Button>

      {downloadList.map((item, index) => {
        let releaseTime = '';
        if (item.metadata && item.metadata.release_time) {
          releaseTime = new Date(parseInt(item.metadata.release_time) * 1000).toISOString().split('T')[0];
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
              stopDownload={stopDownload}
              outpoint={item.outpoint}
              isCancel={cancelHash[item.outpoint]}
              claimID={item.claim_id}
              claimName={item.claim_name}
              handleCancel={handleCancel}
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
    <div className=" download-progress__state-container">
      <div className="download-progress__state-bar">
        <Button
          label={title}
          className="download-progress__state-filename"
          navigate={buildURI({ claimName, claimID })}
        />
        <div
          className="download-progress__close-button"
          onClick={() => {
            handleCancel(outpoint, true);
          }}
        >
          &times;
        </div>
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
