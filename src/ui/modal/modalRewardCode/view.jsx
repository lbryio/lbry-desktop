// @flow
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
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
        type="custom"
        onAborted={closeModal}
      >
        <Form onSubmit={this.handleSubmit}>
          <p>
            {__('Redeem a custom reward code for LBC')}
            {'. '}
            <Button button="link" href="https://lbry.com/faq/rewards#reward-code" label={__('Learn more')} />.
          </p>
          <FormField
            autoFocus
            type="text"
            name="reward-code"
            inputButton={
              <Button
                button="primary"
                type="submit"
                disabled={!rewardCode || rewardIsPending}
                label={rewardIsPending ? __('Redeeming') : __('Redeem')}
              />
            }
            label={__('Code')}
            placeholder="0123abc"
            error={error}
            value={rewardCode}
            onChange={e => this.setState({ rewardCode: e.target.value })}
          />
        </Form>
        <div className="card__actions">
          <Button button="link" label={__('Cancel')} onClick={closeModal} />
        </div>
      </Modal>
    );
  }
}

export default ModalRewardCode;
