// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import CurrencySymbol from 'component/common/lbc-symbol';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';

type Props = {
  totalRewardValue: number,
  currentBalance: number,
  closeModal: () => void,
  addBalance: () => void,
};

const ModalCreditIntro = (props: Props) => {
  const { closeModal, totalRewardValue, currentBalance, addBalance } = props;
  const totalRewardRounded = Math.floor(totalRewardValue / 10) * 10;

  return (
    <Modal type="custom" isOpen contentLabel="Welcome to LBRY">
      <section>
        <h3 className="modal__header">{__('Computer Wizard Needs Tokens Badly')}</h3>
        <p>
          Some actions require LBRY credits (<em>
            <CurrencySymbol />
          </em>), the blockchain token that powers the LBRY network.
        </p>
        {currentBalance <= 0 && (
          <p>
            You currently have <CreditAmount inheritStyle amount={currentBalance} />, so the actions
            you can take are limited.
          </p>
        )}
        {Boolean(totalRewardValue) && (
          <p>
            There are a variety of ways to get credits, including more than{' '}
            <CreditAmount inheritStyle amount={totalRewardRounded} />{' '}
            {__('in free rewards for participating in the LBRY beta.')}
          </p>
        )}
        <div className="card__actions card__actions--center">
          <Button button="primary" onClick={addBalance} label={__('Get Credits')} />
          <Button
            button="link"
            onClick={closeModal}
            label={currentBalance <= 0 ? __('Use Without LBC') : __('Meh, Not Now')}
          />
        </div>
      </section>
    </Modal>
  );
};

export default ModalCreditIntro;
