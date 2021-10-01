// @flow
import React, { useState } from 'react';
import { shell } from 'electron';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

type Props = {
  downloadList: any,
  stopDownload: (outpoint: string, sd_hash: string) => void,
};

function DownloadProgress(props: Props) {
  const [isShow, setIsShow] = useState(true);
  const [cancelHash] = useState({});

  const handleCancel = (hash, value) => {
    cancelHash[hash] = value;
  };
  // return (
  //   <div className="download--header">
  //     <button className="download--top-close-button" onClick={() => setIsShow(false)}>
  //       <div />
  //     </button>
  //     <DownloadState
  //       fileName="being-offended-is-a-bad-trait.mp4"
  //       title="Being offended is a bad trait"
  //       releaseTime={'9/27/2021'}
  //       writtenBytes={100000}
  //       totalBytes={500000}
  //       addedOn={1632388934}
  //     />
  //   </div>
  // );

  // console.log('DownloadProgress', props.downloadList);
  if (!props.downloadList) return null;

  const downloadList = [];
  Object.keys(props.downloadList).map((key) => {
    const item = props.downloadList[key];
    if (item.status === 'running') downloadList.push(item);
  });

  if (downloadList.length === 0) return null;

  if (!isShow) {
    return (
      <button onClick={() => setIsShow(true)} className="download__toggle-button">
        <Icon icon={ICONS.DOWNLOAD} size={40} />
      </button>
    );
  }

  return (
    <div className="download--header">
      <button className="download--top-close-button" onClick={() => setIsShow(false)}>
        <div />
      </button>

      {downloadList.map((item, index) => {
        let releaseTime = '';
        if (item.metadata && item.metadata.release_time) {
          releaseTime = new Date(parseInt(item.metadata.release_time) * 1000).toISOString().split('T')[0];
        }
        return (
          <>
            {index !== 0 && <hr className="download--divider" />}
            <DownloadState
              fileName={item.suggested_file_name}
              title={item.metadata.title}
              releaseTime={releaseTime}
              writtenBytes={item.written_bytes}
              totalBytes={item.total_bytes}
              addedOn={item.added_on}
              directory={item.download_directory}
              stopDownload={props.stopDownload}
              outpoint={item.outpoint}
              sd_hash={item.sd_hash}
              isCancel={cancelHash[item.sd_hash]}
              handleCancel={handleCancel}
            />
          </>
        );
      })}
    </div>
  );
}

type DownloadStateProps = {
  fileName: string,
  writtenBytes: number,
  totalBytes: number,
  addedOn: number,
  title: string,
  releaseTime: string,
  directory: string,
  outpoint: string,
  sd_hash: string,
  isCancel: boolean,
  stopDownload: (outpoint: string, sd_hash: string) => void,
  handleCancel: (hash: string, value: boolean) => void,
};

function DownloadState({
  fileName,
  writtenBytes,
  totalBytes,
  addedOn,
  title,
  releaseTime,
  directory,
  outpoint,
  sd_hash,
  isCancel,
  stopDownload,
  handleCancel,
}: DownloadStateProps) {
  const processStopDownload = () => {
    handleCancel(sd_hash, false);
    stopDownload(outpoint, sd_hash);
  };

  const percent = ((writtenBytes / totalBytes) * 100).toFixed(0);

  const sizeTypeText = ['Bytes', 'KB', 'MB', 'GB'];
  const getSizeType = (size) => Math.floor(Math.log(size) / Math.log(1024));
  const convertSizeUnit = (size, sizeType) => {
    const unitSize = size / Math.pow(1024, sizeType);
    if (unitSize > 100) return unitSize.toFixed(0);
    if (unitSize > 10) return unitSize.toFixed(1);
    return unitSize.toFixed(2);
  };
  const openDownloadFolder = () => {
    shell.openPath(directory);
  };

  let text = '';

  const downloadSpeed = Math.ceil(writtenBytes / (Date.now() / 1000 - addedOn));
  const remainingSecond = Math.ceil((totalBytes - writtenBytes) / downloadSpeed);
  const remainingMinutes = Math.floor(remainingSecond / 60);

  if (remainingMinutes > 0) text += `${remainingMinutes} minutes `;

  text += `${remainingSecond - 60 * remainingMinutes} seconds remaining`;
  text += ' -- ';

  let sizeType = getSizeType(totalBytes);
  text += ` ${convertSizeUnit(writtenBytes, sizeType)} of ${convertSizeUnit(totalBytes, sizeType)} ${
    sizeTypeText[sizeType]
  }`;

  sizeType = getSizeType(downloadSpeed);
  text += ` (${convertSizeUnit(downloadSpeed, sizeType)} ${sizeTypeText[sizeType]}/sec)`;

  return (
    <div className="download--state-container">
      <div className="download--state-bar">
        <p className="download--file-name">{title}</p>
        <div
          className="download--close-button"
          onClick={() => {
            handleCancel(sd_hash, true);
          }}
        >
          &times;
        </div>
      </div>
      <div className="download--state-bar">
        <a className="download--file-name-link" onClick={openDownloadFolder}>
          {fileName}
        </a>
        <p className="download--release-Time">{releaseTime}</p>
      </div>

      <div className="download--state-bar">
        <div className="download--bar-container">
          <div className="download--bar-content" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <p className="download-count-time">{text}</p>
      {isCancel && (
        <div className="download-cancel">
          <p>Do you cancel download this file?</p>
          <div className="download-cancel-confirm">
            <button type="button" className="download-cancel-ok" onClick={processStopDownload}>
              Yes
            </button>
            <button type="button" className="download-cancel-ok" onClick={() => handleCancel(sd_hash, false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DownloadProgress;
