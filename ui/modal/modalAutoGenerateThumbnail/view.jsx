// @flow
import React, { useRef } from 'react';
import { Modal } from 'modal/modal';
import { formatPathForWeb } from 'util/uri';

type Props = {
  upload: WebFile => void,
  filePath: string,
  closeModal: () => void,
  showToast: ({}) => void,
};

function ModalAutoGenerateThumbnail(props: Props) {
  const { closeModal, filePath, upload, showToast } = props;
  const playerRef = useRef();
  let videoSrc;
  if (typeof filePath === 'string') {
    videoSrc = formatPathForWeb(filePath);
  } else {
    videoSrc = URL.createObjectURL(filePath);
  }

  function uploadImage() {
    const imageBuffer = captureSnapshot();
    const file = new File([imageBuffer], 'thumbnail.png', { type: 'image/png' });
    if (imageBuffer) {
      upload(file);
      closeModal();
    } else {
      onError();
    }
  }

  function captureSnapshot(): ?Buffer {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    const rawData = dataURL.replace(/data:image\/\w+;base64,/i, '');
    canvas.remove();
    return Buffer.from(rawData, 'base64');
  }

  function resize(): void {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const fixedWidth = 450;
    const videoWidth = player.videoWidth;
    const videoHeight = player.videoHeight;
    player.width = fixedWidth;
    player.height = Math.floor(videoHeight * (fixedWidth / videoWidth));
  }

  function onError(): void {
    showToast({ isError: true, message: __("Something didn't work. Please try again.") });
  }

  return (
    <Modal
      isOpen
      title={__('Upload Thumbnail')}
      contentLabel={__('Confirm Thumbnail Upload')}
      type="confirm"
      confirmButtonLabel={__('Upload')}
      onConfirmed={uploadImage}
      onAborted={closeModal}
    >
      <p className="card__subtitle">{__('Pause at any time to select a thumbnail from your video')}.</p>
      <video ref={playerRef} src={videoSrc} onLoadedMetadata={resize} onError={onError} controls />
    </Modal>
  );
}

export default ModalAutoGenerateThumbnail;
