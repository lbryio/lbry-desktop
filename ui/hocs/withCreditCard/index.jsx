import React from 'react';

import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import Spinner from 'component/spinner';

import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectHasSavedCard } from 'redux/selectors/stripe';

import { doGetCustomerStatus } from 'redux/actions/stripe';

import { ModalContext } from 'modal/modalRouter/view';

/**
 * HigherOrderComponent to condition a button to become a "add card" prompt every time it is needed for a purchase,
 * and also prompts back to the previous modal in case it came from one.
 *
 * @param Component: FunctionalComponentParam
 * @returns {FunctionalComponent}
 */
const withCreditCard = (Component) => {
  const select = (state) => ({
    hasSavedCard: selectHasSavedCard(state),
  });

  const perform = {
    doOpenModal,
    doGetCustomerStatus,
  };

  const CreditCardPrompt = (props) => {
    // eslint-disable-next-line react/prop-types
    const { hasSavedCard, doOpenModal, doGetCustomerStatus, modalState, ...componentProps } = props;
    const fetching = hasSavedCard === undefined;

    const modal = React.useContext(ModalContext)?.modal;

    React.useEffect(() => {
      if (hasSavedCard === undefined) {
        doGetCustomerStatus();
      }
    }, [doGetCustomerStatus, hasSavedCard]);

    if (!hasSavedCard) {
      const handleOpenAddCardModal = () =>
        doOpenModal(MODALS.ADD_CARD, {
          ...(modal ? { previousModal: modal.id, previousProps: { ...modal.modalProps, ...modalState } } : {}),
        });

      return (
        <Button
          disabled={fetching}
          requiresAuth
          button="primary"
          label={fetching ? <Spinner type="small" /> : __('Add a Credit Card')}
          onClick={handleOpenAddCardModal}
        />
      );
    }

    return <Component {...componentProps} />;
  };

  return connect(select, perform)(CreditCardPrompt);
};

export default withCreditCard;
