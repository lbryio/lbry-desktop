// @flow
import React from 'react';
import './style.scss';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import HomepageSort from 'component/homepageSort';
import MembershipSplash from 'component/membershipSplash';
import * as MODALS from 'constants/modal_types';
import * as SETTINGS from 'constants/settings';
import { Modal } from 'modal/modal';

type HomepageOrder = { active: ?Array<string>, hidden: ?Array<string> };

type Props = {
  userHasOdyseeMembership: ?boolean,
  homepageOrder: HomepageOrder,
  alsoApplyToSidebar: boolean,
  doSetClientSetting: (key: string, value: any, push: boolean) => void,
  doToast: ({ message: string, isError?: boolean }) => void,
  doOpenModal: (id: string, {}) => void,
  doHideModal: () => void,
};

export default function ModalCustomizeHomepage(props: Props) {
  const {
    userHasOdyseeMembership,
    homepageOrder,
    alsoApplyToSidebar,
    doSetClientSetting,
    doToast,
    doOpenModal,
    doHideModal,
  } = props;

  const [applyToSidebar, setApplyToSidebar] = React.useState(alsoApplyToSidebar);
  const order = React.useRef();

  function handleNewOrder(newOrder: HomepageOrder) {
    order.current = newOrder;
  }

  function handleSave() {
    // Non-English homepages created their own categories, so that made things
    // complicated. Store every new key encountered, and just not show them
    // in the GUI depending on the selected homepage language.
    // Be sure not to erase any saved keys.
    if (order.current) {
      const orderToSave: HomepageOrder = order.current;

      if (orderToSave.active && orderToSave.hidden) {
        if (homepageOrder.active) {
          homepageOrder.active.forEach((x) => {
            // $FlowIgnore: null case handled.
            if (!orderToSave.active.includes(x) && !orderToSave.hidden.includes(x)) {
              // $FlowIgnore: null case handled.
              orderToSave.active.push(x);
            }
          });
        }

        if (homepageOrder.hidden) {
          homepageOrder.hidden.forEach((x) => {
            // $FlowIgnore: null case handled.
            if (!orderToSave.active.includes(x) && !orderToSave.hidden.includes(x)) {
              // $FlowIgnore: null case handled.
              orderToSave.hidden.push(x);
            }
          });
        }

        doSetClientSetting(SETTINGS.HOMEPAGE_ORDER, orderToSave, true);
      } else {
        console.error('Homepage: invalid orderToSave', orderToSave); // eslint-disable-line no-console
      }
    }

    doSetClientSetting(SETTINGS.HOMEPAGE_ORDER_APPLY_TO_SIDEBAR, applyToSidebar, true);
    doHideModal();
  }

  function handleReset() {
    doOpenModal(MODALS.CONFIRM, {
      title: __('Reset homepage to defaults?'),
      subtitle: __('This action is permanent and cannot be undone'),
      onConfirm: (closeModal) => {
        doSetClientSetting(SETTINGS.HOMEPAGE_ORDER, { active: null, hidden: null }, true);
        doToast({ message: __('Homepage restored to default.') });
        closeModal();
      },
    });
  }

  return (
    <Modal
      className="modal-customize-homepage"
      isOpen
      type={userHasOdyseeMembership ? 'custom' : 'card'}
      width={userHasOdyseeMembership ? 'wide-fixed' : 'wide'}
      onAborted={userHasOdyseeMembership ? undefined : doHideModal}
    >
      {!userHasOdyseeMembership && (
        <Card
          title={__('Customize Homepage')}
          subtitle={__('This is currently an early-access feature for Premium members.')}
          body={
            <div className="card__main-actions">
              <MembershipSplash pageLocation={'confirmPage'} currencyToUse={'usd'} />
            </div>
          }
        />
      )}

      {userHasOdyseeMembership && (
        <Card
          title={__('Customize Homepage')}
          body={
            <div className="modal-customize-homepage__body">
              <HomepageSort onUpdate={handleNewOrder} />
              <Button button="link" label={__('Reset')} onClick={handleReset} />
              <FormField
                type="checkbox"
                name="apply_to_sidebar"
                label={__('Also apply to sidebar')}
                checked={applyToSidebar}
                onChange={() => setApplyToSidebar((prev) => !prev)}
              />
            </div>
          }
          actions={
            <div className="modal-customize-homepage__actions section__actions">
              <Button button="primary" label={__('Save')} onClick={handleSave} />
              <Button button="link" label={__('Cancel')} onClick={doHideModal} />
            </div>
          }
        />
      )}
    </Modal>
  );
}
