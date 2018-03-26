// I'll come back to this
/* esline-disable */
import React from 'react';
import { Modal } from 'modal/modal';
import CurrencySymbol from 'component/common/lbc-symbol';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';

const ModalCreditIntro = props => {
  const { closeModal, totalRewardValue, currentBalance, addBalance } = props;
  const totalRewardRounded = Math.round(totalRewardValue / 10) * 10;

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
            You currently have <CreditAmount amount={currentBalance} />, so the actions you can take
            are limited.
          </p>
        )}
        <p>
          There are a variety of ways to get credits, including more than{' '}
          {totalRewardValue ? (
            <CreditAmount amount={totalRewardRounded} />
          ) : (
            <span className="credit-amount">{__('?? credits')}</span>
          )}{' '}
          {__(' in free rewards for participating in the LBRY beta.')}
        </p>

        <div className="modal__buttons">
          <Button button="primary" onClick={addBalance} label={__('Get Credits')} />
          <Button
            button="alt"
            onClick={closeModal}
            label={currentBalance <= 0 ? __('Use Without LBC') : __('Meh, Not Now')}
          />
        </div>
      </section>
    </Modal>
  );
};

export default ModalCreditIntro;
/* esline-enable */
