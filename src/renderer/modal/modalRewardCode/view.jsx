// @flow
import * as React from 'react';
import { FormRow, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  error: ?string,
  rewardIsPending: boolean,
  submitRewardCode: string => void,
};

type State = {
  rewardCode: string,
};

class ModalRewardCode extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      rewardCode: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { rewardCode } = this.state;
    const { submitRewardCode } = this.props;
    submitRewardCode(rewardCode);
  }

  render() {
    const { closeModal, rewardIsPending, error } = this.props;
    const { rewardCode } = this.state;

    return (
      <Modal
        isOpen
        contentLabel={__('Enter Reward Code')}
        type="confirm"
        confirmButtonLabel={__('Redeem')}
        abortButtonLabel={__('Cancel')}
        onConfirmed={this.handleSubmit}
        onAborted={closeModal}
        confirmButtonDisabled={rewardIsPending}
      >
        <h3 className="modal__header">{__('Enter Reward Code')}</h3>
        <div className="card__content">
          <FormRow>
            <FormField
              stretch
              autoFocus
              type="text"
              label={__('Code')}
              placeholder="0123abc"
              error={error}
              value={rewardCode}
              onChange={e => this.setState({ rewardCode: e.target.value })}
              helper={
                <React.Fragment>
                  {__('Redeem a LBRY generated reward code for LBC')}
                  {'. '}
                  <Button
                    button="link"
                    href="https://lbry.io/faq/reward-codes"
                    label={__('Learn more')}
                  />.
                </React.Fragment>
              }
            />
          </FormRow>
        </div>
      </Modal>
    );
  }
}

export default ModalRewardCode;
