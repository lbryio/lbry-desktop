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
        title={__('Enter Reward Code')}
        contentLabel={__('Enter Reward Code')}
        type="confirm"
        confirmButtonLabel={__('Redeem')}
        abortButtonLabel={__('Cancel')}
        onConfirmed={this.handleSubmit}
        onAborted={closeModal}
        confirmButtonDisabled={rewardIsPending}
      >
        <section className="card__content">
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
                  {__('Redeem a custom reward code for LBC')}
                  {'. '}
                  <Button
                    button="link"
                    href="https://lbry.io/faq/rewards#reward-code"
                    label={__('Learn more')}
                  />.
                </React.Fragment>
              }
            />
          </FormRow>
        </section>
      </Modal>
    );
  }
}

export default ModalRewardCode;
