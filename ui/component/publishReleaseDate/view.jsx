// @flow
import React from 'react';
import Button from 'component/button';
import DateTimePicker from 'react-datetime-picker';

function linuxTimestampToDate(linuxTimestamp: number) {
  return new Date(linuxTimestamp * 1000);
}

function dateToLinuxTimestamp(date: Date) {
  return Number(Math.round(date.getTime() / 1000));
}

const NOW = 'now';
const DEFAULT = 'default';
const RESET_TO_ORIGINAL = 'reset-to-original';

type Props = {
  releaseTime: ?number,
  releaseTimeEdited: ?number,
  updatePublishForm: ({}) => void,
};

const PublishReleaseDate = (props: Props) => {
  const { releaseTime, releaseTimeEdited, updatePublishForm } = props;
  const maxDate = new Date();
  const [date, setDate] = React.useState(releaseTime ? linuxTimestampToDate(releaseTime) : new Date());

  const isNew = releaseTime === undefined;
  const isEdit = !isNew;

  const showEditBtn = isNew && releaseTimeEdited === undefined;
  const showDefaultBtn = isNew && releaseTimeEdited !== undefined;
  const showDatePicker = isEdit || releaseTimeEdited !== undefined;

  const onDateTimePickerChanged = (value) => {
    if (value) {
      newDate(value);
    } else {
      // "!value" should never happen since we now hide the "clear" button,
      // but retained the logic here anyway.
      if (releaseTime) {
        newDate(RESET_TO_ORIGINAL);
      } else {
        newDate(NOW);
      }
    }
  };

  function newDate(value: string | Date) {
    switch (value) {
      case NOW:
        const newDate = new Date();
        setDate(newDate);
        updatePublishForm({ releaseTimeEdited: dateToLinuxTimestamp(newDate) });
        break;

      case DEFAULT:
        setDate(undefined);
        updatePublishForm({ releaseTimeEdited: undefined });
        break;

      case RESET_TO_ORIGINAL:
        if (releaseTime) {
          setDate(linuxTimestampToDate(releaseTime));
          updatePublishForm({ releaseTimeEdited: undefined });
        }
        break;

      default:
        if (value instanceof Date) {
          setDate(value);
          updatePublishForm({ releaseTimeEdited: dateToLinuxTimestamp(value) });
        }
        break;
    }
  }

  return (
    <div className="form-field-date-picker">
      <label>Release date</label>
      <div className="controls">
        {showDatePicker && (
          <DateTimePicker
            className="date-picker-input"
            calendarClassName="form-field-calendar"
            onChange={onDateTimePickerChanged}
            value={date}
            maxDate={maxDate}
            format="y-MM-dd h:mm a"
            disableClock
            clearIcon={null}
          />
        )}
        {showEditBtn && (
          <Button
            button="link"
            label={__('Edit')}
            aria-label={__('Set custom release date')}
            onClick={() => newDate(NOW)}
          />
        )}
        {showDatePicker && isEdit && releaseTime && (
          <Button
            button="link"
            label={__('Reset')}
            aria-label={__('Reset to original (previous) publish date')}
            onClick={() => newDate(RESET_TO_ORIGINAL)}
          />
        )}
        {showDatePicker && (
          <Button
            button="link"
            label={__('Now')}
            aria-label={__('Set to current date and time')}
            onClick={() => newDate(NOW)}
          />
        )}
        {showDefaultBtn && (
          <Button
            button="link"
            label={__('Default')}
            aria-label={__('Remove custom release date')}
            onClick={() => newDate(DEFAULT)}
          />
        )}
      </div>
    </div>
  );
};

export default PublishReleaseDate;
