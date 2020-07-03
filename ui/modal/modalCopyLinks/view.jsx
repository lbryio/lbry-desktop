// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import CopyableText from 'component/copyableText';
import { generateDownloadUrl } from 'util/web';
import { generateLbryContentUrl, generateLbryWebUrl, generateOpenDotLbryDotComUrl } from 'util/url';

type Props = {
  claim: StreamClaim,
  closeModal: () => void,
};

class ModalCopyLinks extends React.PureComponent<Props> {
  render() {
    const { claim, closeModal } = this.props;
    const { canonical_url: canonicalUrl, permanent_url: permanentUrl, name, claim_id: claimId } = claim;

    const OPEN_URL = 'https://open.lbry.com/';
    const lbryUrl: string = generateLbryContentUrl(canonicalUrl, permanentUrl);
    const lbryWebUrl: string = generateLbryWebUrl(lbryUrl);
    const openDotLbryDotComUrl: string = generateOpenDotLbryDotComUrl(OPEN_URL, lbryWebUrl, canonicalUrl, permanentUrl);
    const downloadUrl = `${generateDownloadUrl(name, claimId)}`;

    return (
      <Modal isOpen type="card" onAborted={closeModal}>
        <Card
          title={__('Links')}
          actions={
            <React.Fragment>
              <CopyableText
                label={__('LBRY Link')}
                snackMessage={__('LBRY link copied')}
                copyable={openDotLbryDotComUrl}
              />
              <CopyableText
                label={__('LBRY URL')}
                snackMessage={__('LBRY URL copied')}
                copyable={`lbry://${lbryUrl}`}
              />
              <CopyableText
                label={__('Download Link')}
                snackMessage={__('Download link copied')}
                copyable={downloadUrl}
              />
            </React.Fragment>
          }
        />
      </Modal>
    );
  }
}

export default ModalCopyLinks;
