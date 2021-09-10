// @flow
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  closeModal: () => void,
  error: ?string,
  rewardIsPending: boolean,
  submitRewardCode: (string) => void,
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
      <Modal isOpen contentLabel={__('Enter reward code')} type="card" onAborted={closeModal}>
        <Card
          title={__('Enter reward code')}
          subtitle={
            <I18nMessage
              tokens={{
                lbc: <LbcSymbol prefix={__('Redeem a custom reward code for')} />,
                learn_more: (
                  <Button
                    button="link"
                    href="https://odysee.com/@OdyseeHelp:b/rewards-verification:3#reward-code"
                    label={__('Learn more')}
                  />
                ),
              }}
            >
              %lbc%. %learn_more%.
            </I18nMessage>
          }
          actions={
            <>
              <Form onSubmit={this.handleSubmit}>
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
                  onChange={(e) => this.setState({ rewardCode: e.target.value })}
                />
              </Form>
              <div className="card__actions">
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
              </div>
            </>
          }
        />
      </Modal>
    );
  }
}

export default ModalRewardCode;
