// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import MarkdownPreview from 'component/common/markdown-preview';
import * as PAGES from 'constants/pages';
import { Modal } from 'modal/modal';
import { getSimpleStrHash } from 'util/string';

type Props = {
  isAutoInvoked?: boolean,
  // --- redux ---
  authenticated?: boolean,
  announcement: string,
  lastViewedHash: ?string,
  doHideModal: () => void,
  doSetLastViewedAnnouncement: (hash: string) => void,
};

export default function ModalAnnouncements(props: Props) {
  const {
    authenticated,
    announcement,
    lastViewedHash,
    isAutoInvoked,
    doHideModal,
    doSetLastViewedAnnouncement,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!authenticated || (pathname !== '/' && pathname !== `/$/${PAGES.HELP}`) || announcement === '') {
      doHideModal();
      return;
    }

    const hash = getSimpleStrHash(announcement);

    if (lastViewedHash === hash) {
      if (isAutoInvoked) {
        doHideModal();
      } else {
        setShow(true);
      }
    } else {
      setShow(true);
      doSetLastViewedAnnouncement(hash);
    }
  }, []);

  if (!show) {
    return null;
  }

  return (
    <Modal type="card" isOpen onAborted={doHideModal}>
      <Card
        className="announcement"
        actions={<MarkdownPreview className="markdown-preview--announcement" content={announcement} simpleLinks />}
      />
    </Modal>
  );
}
