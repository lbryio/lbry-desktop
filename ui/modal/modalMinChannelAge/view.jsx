// @flow
import React from 'react';
import moment from 'moment';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form-components/form-field';
import FormFieldDuration from 'component/formFieldDuration';
import { Modal } from 'modal/modal';

const CHANNEL_AGE_LIMIT_MIN_DATE = new Date('February 8, 2022 00:00:00');
const LIMITATION_WARNING = 'The minimum duration must not exceed Feb 8th, 2022.';

type Props = {
  onConfirm: (limitInMinutes: number, closeModal: () => void) => void,
  doHideModal: () => void,
};

export default function ModalMinChannelAge(props: Props) {
  const { onConfirm, doHideModal } = props;

  const [showLimitationWarning, setShowLimitationWarning] = React.useState('');
  const [limitDisabled, setLimitDisabled] = React.useState(false);
  const [minChannelAgeInput, setMinChannelAgeInput] = React.useState('');
  const [minChannelAgeMinutes, setMinChannelAgeMinutes] = React.useState(-1);
  const inputOk = limitDisabled || (minChannelAgeMinutes > 0 && !showLimitationWarning);

  function handleOnClick() {
    if (onConfirm) {
      onConfirm(limitDisabled ? 0 : minChannelAgeMinutes, doHideModal);
    }
  }

  function handleOnInputResolved(valueInSeconds) {
    if (valueInSeconds > 0) {
      const minCreationDate = moment().subtract(valueInSeconds, 'seconds').toDate();
      setShowLimitationWarning(minCreationDate.getTime() < CHANNEL_AGE_LIMIT_MIN_DATE.getTime());
      setMinChannelAgeMinutes(Math.ceil(valueInSeconds / 60));
    } else {
      setShowLimitationWarning(false);
      setMinChannelAgeMinutes(-1);
    }
  }

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <Card
        title={__('Set minimum channel age')}
        body={
          <>
            <FormFieldDuration
              name="time_since_first_comment"
              value={minChannelAgeInput}
              disabled={limitDisabled}
              onChange={(e) => setMinChannelAgeInput(e.target.value)}
              onResolve={handleOnInputResolved}
            />
            {showLimitationWarning && !limitDisabled && <p className="help--warning">{__(LIMITATION_WARNING)}</p>}
            <FormField
              type="checkbox"
              name="no_limit"
              label={__('No limit')}
              checked={limitDisabled}
              onChange={() => setLimitDisabled(!limitDisabled)}
            />
          </>
        }
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('OK')} onClick={handleOnClick} disabled={!inputOk} />
            <Button button="link" label={__('Cancel')} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
}
