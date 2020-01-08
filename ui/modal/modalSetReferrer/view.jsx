// @flow
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  error: ?string,
  rewardIsPending: boolean,
  setReferrer: (string, boolean) => void,
  setReferrerPending: boolean,
  setReferrerError?: string,
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
  }

  handleSubmit() {
    const { referrer } = this.state;
    const { setReferrer } = this.props;
    setReferrer(referrer, true);
  }

  render() {
    const { closeModal, rewardIsPending } = this.props;
    const { referrer } = this.state;

    return (
      <Modal
        isOpen
        title={__('Enter Referrer')}
        contentLabel={__('Enter Referrer')}
        type="custom"
        onAborted={closeModal}
      >
        <Form onSubmit={this.handleSubmit}>
          <p>
            {__('Tell us who referred you and get a reward!')}
            <Button button="link" href="https://lbry.com/faq/referrals" label={__('?')} />.
          </p>
          <FormField
            autoFocus
            type="text"
            name="referrer-code"
            inputButton={
              <Button button="primary" type="submit" disabled={!referrer || rewardIsPending} label={__('Set')} />
            }
            label={__('Code')}
            placeholder="0123abc"
            value={referrer}
            onChange={e => this.setState({ referrer: e.target.value })}
          />
        </Form>
        <div className="card__actions">
          <Button button="primary" label={__('Done')} onClick={closeModal} />
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Modal>
    );
  }
}

export default ModalSetReferrer;
