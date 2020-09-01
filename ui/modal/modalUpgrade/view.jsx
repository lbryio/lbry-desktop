// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

type Props = {
  downloadUpgrade: () => void,
  skipUpgrade: () => void,
};

class ModalUpgrade extends React.PureComponent<Props> {
  render() {
    const { downloadUpgrade, skipUpgrade } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Upgrade available')}
        title={__('LBRY Leveled Up')}
        type="confirm"
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Skip')}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        <p>
          {__('An updated version of LBRY is now available.')}{' '}
          {__('Your version is out of date and may be unreliable or insecure.')}
        </p>
        <p className="help">
          <I18nMessage
            tokens={{
              release_notes: (
                <Button
                  button="link"
                  label={__('release notes')}
                  href="https://github.com/lbryio/lbry-desktop/releases"
                />
              ),
            }}
          >
            Want to know what has changed? See the %release_notes%.
          </I18nMessage>
        </p>
      </Modal>
    );
  }
}

export default ModalUpgrade;
