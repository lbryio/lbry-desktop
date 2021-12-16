// @flow
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import HelpLink from 'component/common/help-link';
import Card from 'component/common/card';

type Props = {
  closeModal: () => void,
  error: ?string,
  rewardIsPending: boolean,
  setReferrer: (string, boolean) => void,
  referrerSetPending: boolean,
  referrerSetError?: string,
  resetReferrerError: () => void,
};

type State = {
  referrer: string,
};

class ModalSetReferrer extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      referrer: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleClose = this.handleClose.bind(this);
    (this: any).handleTextChange = this.handleTextChange.bind(this);
  }

  handleSubmit() {
    const { referrer } = this.state;
    const { setReferrer } = this.props;
    setReferrer(referrer, true);
  }

  handleClose() {
    const { referrerSetError, resetReferrerError, closeModal } = this.props;
    if (referrerSetError) {
      resetReferrerError();
    }
    closeModal();
  }

  handleTextChange(e: SyntheticInputEvent<*>) {
    const { referrerSetError, resetReferrerError } = this.props;

    this.setState({ referrer: e.target.value });
    if (referrerSetError) {
      resetReferrerError();
    }
  }

  render() {
    const { closeModal, rewardIsPending, referrerSetError, referrerSetPending } = this.props;
    const { referrer } = this.state;

    return (
      <Modal isOpen contentLabel={__('Enter inviter')} type="card" onAborted={closeModal}>
        <Card
          title={__('Enter inviter')}
          subtitle={
            <React.Fragment>
              {__('Did someone invite you to use Odysee? Tell us who and you both get a reward!')}
              <HelpLink href="https://odysee.com/@OdyseeHelp:b/rewards-verification:3" />
            </React.Fragment>
          }
          actions={
            <React.Fragment>
              <Form onSubmit={this.handleSubmit}>
                <FormField
                  autoFocus
                  type="text"
                  name="referrer-code"
                  inputButton={
                    <Button button="primary" type="submit" disabled={!referrer || rewardIsPending} label={__('Set')} />
                  }
                  label={__('Code or channel')}
                  placeholder="0123abc"
                  value={referrer}
                  onChange={this.handleTextChange}
                  error={!referrerSetPending && referrerSetError}
                />
              </Form>
              <div className="card__actions">
                <Button button="primary" label={__('Done')} onClick={this.handleClose} />
              </div>
            </React.Fragment>
          }
        />
      </Modal>
    );
  }
}

export default ModalSetReferrer;
