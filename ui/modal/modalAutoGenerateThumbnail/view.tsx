import React, {useRef} from 'react';
import { Modal } from 'modal/modal';
import { formatFileSystemPath } from 'util/url';

type Props = {
  upload: (arg1: File) => void,
  filePath: string,
  closeModal: () => void,
  showToast: (arg1: Record<any, any>) => void
};

function ModalAutoGenerateThumbnail(props: Props) {
  const { closeModal, filePath, upload, showToast } = props;
  const playerRef = useRef();
  let videoSrc;
  if (typeof filePath === 'string') {
    videoSrc = formatFileSystemPath(filePath);
  } else {
    videoSrc = URL.createObjectURL(filePath);
  }

  function uploadImage() {
    const imageBuffer = captureSnapshot();
    // @ts-expect-error - TS2322 (ts-migration)
    const file = new File([imageBuffer], 'thumbnail.png', { type: 'image/png' });

    if (imageBuffer) {
      upload(file);
      closeModal();
    } else {
      onError();
    }
  }

  function captureSnapshot(): Buffer | null | undefined {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const canvas = document.createElement('canvas');
// @ts-expect-error - TS2339 - Property 'videoWidth' does not exist on type 'never'.
    canvas.width = player.videoWidth;
// @ts-expect-error - TS2339 - Property 'videoHeight' does not exist on type 'never'.
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
// @ts-expect-error - TS2339 - Property 'videoWidth' does not exist on type 'never'.
    const videoWidth = player.videoWidth;
// @ts-expect-error - TS2339 - Property 'videoHeight' does not exist on type 'never'.
    const videoHeight = player.videoHeight;
// @ts-expect-error - TS2339 - Property 'width' does not exist on type 'never'.
    player.width = fixedWidth;
// @ts-expect-error - TS2339 - Property 'height' does not exist on type 'never'.
    player.height = Math.floor(videoHeight * (fixedWidth / videoWidth));
  }

  function onError(): void {
    showToast({ isError: true, message: __("Something didn't work. Please try again.") });
  }

  return (
    <Modal
// @ts-expect-error - TS2322 - Type '{ children: Element[]; isOpen: true; title: string; contentLabel: string; type: string; confirmButtonLabel: string; onConfirmed: () => void; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      isOpen
      title={__('Upload thumbnail')}
      contentLabel={__('Confirm Thumbnail Upload')}
      type="confirm"
      confirmButtonLabel={__('Upload')}
      onConfirmed={uploadImage}
      onAborted={closeModal}
    >
      <p className="section__subtitle">{__('Pause at any time to select a thumbnail from your video')}.</p>
      <video ref={playerRef} src={videoSrc} onLoadedMetadata={resize} onError={onError} controls />
    </Modal>
  );
}

export default ModalAutoGenerateThumbnail;
