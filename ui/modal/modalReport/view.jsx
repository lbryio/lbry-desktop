// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  closeModal: () => void,
};

const ModalReport = (props: Props) => {
  const { closeModal } = props;
  const [selectedBtn, setSelectedBtn] = useState(0);

  const confirmReport = e => {
    e.preventDefault();

    closeModal();
  };

  return (
    <Modal type="custom" isOpen contentLabel="Report Content" title={__('Report Content')}>
      <p>{__('Choose an option according to the violation')}</p>

      <br />
      <hr />
      <br />

      <React.Fragment>
        <FormField
          checked={selectedBtn === 0}
          type="radio"
          onClick={() => setSelectedBtn(0)}
          name="Mistagged content"
          label={__('Mistagged Content')}
        />
        <FormField
          checked={selectedBtn === 1}
          type="radio"
          onClick={() => setSelectedBtn(1)}
          name="Spam"
          label={__('Spam')}
        />
        <FormField
          checked={selectedBtn === 2}
          type="radio"
          onClick={() => setSelectedBtn(2)}
          name="Illegal Promotions"
          label={__('Illegal Promotion')}
        />
        <FormField
          checked={selectedBtn === 3}
          type="radio"
          onClick={() => setSelectedBtn(3)}
          name="Violent Or Repulsive"
          label={__('Violent Or Repulsive')}
        />
        <FormField
          checked={selectedBtn === 4}
          type="radio"
          onClick={() => setSelectedBtn(4)}
          name="Child Abuse"
          label={__('Child Abuse')}
        />
        <FormField
          checked={selectedBtn === 5}
          type="radio"
          onClick={() => setSelectedBtn(5)}
          name="Promotes Terrorism"
          label={__('Promotes Terrorism')}
        />
      </React.Fragment>
      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Report')} />
        <Button button="alt" onClick={closeModal} label={__('Close')} />
      </div>
    </Modal>
  );
};

export default ModalReport;
