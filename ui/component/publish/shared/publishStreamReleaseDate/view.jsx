// @flow
import React, { useEffect } from 'react';
import { FormField } from 'component/common/form';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';

function linuxTimestampToDate(linuxTimestamp: number) {
  return new Date(linuxTimestamp * 1000);
}

function dateToLinuxTimestamp(date: Date) {
  return Number(Math.round(date.getTime() / 1000));
}

type Props = {
  isScheduled: boolean,
  releaseTime: ?number,
  updatePublishForm: ({}) => void,
};
const PublishStreamReleaseDate = (props: Props) => {
  const { isScheduled, releaseTime, updatePublishForm } = props;

  const [date, setDate] = React.useState(releaseTime ? linuxTimestampToDate(releaseTime) : 'DEFAULT');
  const [publishLater, setPublishLater] = React.useState(isScheduled);

  const handleToggle = () => {
    const shouldPublishLater = !publishLater;
    setPublishLater(shouldPublishLater);
    onDateTimePickerChanged(
      shouldPublishLater ? moment().add('1', 'hour').add('30', 'minutes').startOf('hour').toDate() : 'DEFAULT'
    );
  };

  const onDateTimePickerChanged = (value) => {
    if (value === 'DEFAULT') {
      setDate(undefined);
      updatePublishForm({ releaseTimeEdited: undefined, releaseAnytime: true });
    } else {
      setDate(value);
      updatePublishForm({ releaseTimeEdited: dateToLinuxTimestamp(value), releaseAnytime: false });
    }
  };

  useEffect(() => {
    if (!isScheduled) updatePublishForm({ releaseTimeEdited: undefined, releaseAnytime: true });
    return () => updatePublishForm({ releaseTimeEdited: undefined, releaseAnytime: false });
  }, []);

  const helpText = !publishLater
    ? __(
        'Confirmation process takes a few minutes, but then you can go live anytime. The stream is not shown anywhere until you are broadcasting.'
      )
    : __(
        'Your scheduled streams will appear on your channel page and for your followers. Chat will not be active until 5 minutes before the start time.'
      );

  return (
    <>
      <h2 className="card__title">{__('Date')}</h2>
      <div className="card--date">
        <label htmlFor="date-picker-input">{__('When do you want to go live?')}</label>

        <div className={'w-full flex flex-col mt-s md:mt-0 md:h-12 md:items-center md:flex-row'}>
          <FormField
            type="radio"
            name="anytime"
            disabled={false}
            onChange={handleToggle}
            checked={!publishLater}
            label={__('Anytime')}
          />

          <div className={'md:ml-m mt-s md:mt-0'}>
            <FormField
              type="radio"
              name="scheduled_time"
              disabled={false}
              onChange={handleToggle}
              checked={publishLater}
              label={__('Scheduled Time')}
            />
          </div>
          {publishLater && (
            <div className="form-field-date-picker mb-0 controls md:ml-m">
              <DateTimePicker
                className="date-picker-input w-full md:w-auto mt-s md:mt-0"
                calendarClassName="form-field-calendar"
                onChange={onDateTimePickerChanged}
                value={date}
                format="y-MM-dd h:mm a"
                disableClock
                clearIcon={null}
                minDate={moment().add('30', 'minutes').toDate()}
              />
            </div>
          )}
        </div>

        <p className={'form-field__hint mt-m'}>{helpText}</p>
      </div>
    </>
  );
};

export default PublishStreamReleaseDate;
