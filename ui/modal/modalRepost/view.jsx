// @flow
import React from 'react';
import { useHistory } from 'react-router';
import Modal from 'modal/modal';
import RepostCreate from 'component/repostCreate';
import useThrottle from 'effects/use-throttle';

type Props = {
  uri?: string,
  contentName?: string,
  // --- redux ---
  closeModal: () => void,
  resolveUri: (string) => void,
};

function ModalRepost(props: Props) {
  const { uri, contentName, closeModal, resolveUri } = props;

  const {
    location: { search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const param = urlParams.get('name') || urlParams.get('q') || contentName;
  const repostTo = param && (param[0] === '@' ? param.slice(1) : param.replace(/\s/g, '')); // remove spaces

  const [contentUri, setContentUri] = React.useState('');
  const [repostUri, setRepostUri] = React.useState('');
  const throttledContentValue = useThrottle(contentUri, 500);
  const throttledRepostValue = useThrottle(repostUri, 500);

  React.useEffect(() => {
    if (throttledContentValue) {
      resolveUri(throttledContentValue);
    }
  }, [throttledContentValue, resolveUri]);

  React.useEffect(() => {
    if (throttledRepostValue) {
      resolveUri(throttledRepostValue);
    }
  }, [throttledRepostValue, resolveUri]);

  React.useEffect(() => {
    if (repostTo) {
      resolveUri(repostTo);
    }
  }, [repostTo, resolveUri]);

  return (
    <Modal onAborted={closeModal} isOpen type="card">
      <RepostCreate
        uri={uri}
        name={repostTo}
        contentUri={contentUri}
        repostUri={repostUri}
        setContentUri={setContentUri}
        setRepostUri={setRepostUri}
      />
    </Modal>
  );
}

export default ModalRepost;
