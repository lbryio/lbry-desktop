// @flow
import React, { useCallback } from 'react';
import DateTimePicker from 'react-datetime-picker';

type Props = {
  releaseTime: ?number,
  updatePublishForm: ({}) => void,
};

const PublishReleaseDate = (props: Props) => {
  const { releaseTime, updatePublishForm } = props;
  const maxDate = new Date();

  const dateOrToday = useCallback((value) => {
    return value ? new Date(value) : new Date();
  }, []);

  const onChange = useCallback((value) => {
    updatePublishForm({ release_time: dateOrToday(value) });
  }, []);

  return (
    <div className="form-field-date-picker">
      <label>Release date</label>
      <DateTimePicker
        className="date-picker-input"
        calendarClassName="form-field-calendar"
        onChange={onChange}
        value={dateOrToday(releaseTime)}
        maxDate={maxDate}
        format="y-MM-dd h:mm a"
        disableClock
      />
    </div>
  );
};

export default PublishReleaseDate;
