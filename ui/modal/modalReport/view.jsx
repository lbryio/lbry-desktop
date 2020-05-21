// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import * as ICONS from 'constants/icons';

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
          label={
            <div>
              {__('Mistagged Content')}
              <Button
                className="icon--help"
                title={__('Wrong tags, Mature content not tagged "Mature", Tag abuse, Tag filter bypass attempt')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 1}
          type="radio"
          onClick={() => setSelectedBtn(1)}
          name="Spam"
          label={
            <div>
              {__('Spam')}
              <Button
                className="icon--help"
                title={__(
                  'Excessively Posted,Untargeted,Misleading,Malformed/Manipulated Content or Contains Malware.'
                )}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 2}
          type="radio"
          onClick={() => setSelectedBtn(2)}
          name="Illegal Promotions"
          label={
            <div>
              {__('Illegal Promotion')}
              <Button
                className="icon--help"
                title={__('Selling/Promoting drugs,guns or other illegal material or potentially prohibited by law')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 3}
          type="radio"
          onClick={() => setSelectedBtn(3)}
          name="Violent or Repulsive"
          label={
            <div>
              {__('Violent or Repulsive')}
              <Button
                className="icon--help"
                title={__(
                  'Inciting for violent acts, Physical or Sexual assaults, Media containing severed limbs or such procedures'
                )}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 4}
          type="radio"
          onClick={() => setSelectedBtn(4)}
          name="Child Abuse"
          label={
            <div>
              {__('Child Abuse')}
              <Button
                className="icon--help"
                title={__('Physical or Sexual assault or Mental/Emotional maltreatment which involves "Child"')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />
        <FormField
          checked={selectedBtn === 5}
          type="radio"
          onClick={() => setSelectedBtn(5)}
          name="Promotes Terrorism"
          label={
            <div>
              {__('Promotes Terrorism')}
              <Button
                className="icon--help"
                title={__('Medias inciting terrorism or extremism or refers to such organization')}
                icon={ICONS.HELP}
                description={__('Help')}
              />
            </div>
          }
        />

        <br />
        <hr />
        <br />

        <div>
          <FormField
            type="text"
            name="Why do you think this violates our policy?"
            label={__('Why do you think this violates our policy?')}
          />
        </div>
      </React.Fragment>
      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Report')} />
        <Button button="alt" onClick={closeModal} label={__('Close')} />
      </div>
    </Modal>
  );
};

export default ModalReport;
