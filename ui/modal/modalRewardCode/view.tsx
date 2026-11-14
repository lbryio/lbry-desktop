import * as React from "react";
import { FormField, Form } from "component/common/form";
import { Modal } from "modal/modal";
import Button from "component/button";
import Card from "component/common/card";
import I18nMessage from "component/i18nMessage";
import LbcSymbol from "component/common/lbc-symbol";

type Props = {
  closeModal: () => void;
  error: string | null | undefined;
  rewardIsPending: boolean;
  submitRewardCode: (arg1: string) => void;
};

type State = {
  rewardCode: string;
};

class ModalRewardCode extends React.PureComponent<Props, State> {
  constructor() {
    // @ts-expect-error - TS2554 - Expected 1-2 arguments, but got 0.
    super();

    this.state = {
      rewardCode: "",
    };

    (this as any).handleSubmit = this.handleSubmit.bind(this);
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
      // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      <Modal isOpen contentLabel={__("Enter reward code")} type="card" onAborted={closeModal}>
        <Card
          title={__("Enter reward code")}
          subtitle={
            // @ts-expect-error - TS2745 (ts-migration)
            <I18nMessage
              // @ts-expect-error - TS2322 (ts-migration)
              tokens={{
                lbc: <LbcSymbol prefix={__("Redeem a custom reward code for")} />,
                learn_more: (
                  // @ts-expect-error - TS2322 (ts-migration)
                  <Button button="link" href="https://lbry.com/faq/rewards#reward-code" label={__("Learn more")} />
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
                      // @ts-expect-error - TS2322 (ts-migration)
                      button="primary"
                      type="submit"
                      disabled={!rewardCode || rewardIsPending}
                      label={rewardIsPending ? __("Redeeming") : __("Redeem")}
                    />
                  }
                  label={__("Code")}
                  placeholder="0123abc"
                  error={error}
                  value={rewardCode}
                  onChange={(e) => this.setState({ rewardCode: e.target.value })}
                />
              </Form>
              <div className="card__actions">
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <Button button="link" label={__("Cancel")} onClick={closeModal} />
              </div>
            </>
          }
        />
      </Modal>
    );
  }
}

export default ModalRewardCode;
