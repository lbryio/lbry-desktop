// @flow
import React from 'react';
import DateTimePicker from 'react-datetime-picker';

function linuxTimestampToDate(linuxTimestamp: number) {
  return new Date(linuxTimestamp * 1000);
}

function dateToLinuxTimestamp(date: Date) {
  return Number(Math.round(date.getTime() / 1000));
}

type Props = {
  releaseTime: ?number,
  updatePublishForm: ({}) => void,
};

const PublishReleaseDate = (props: Props) => {
  const { releaseTime, updatePublishForm } = props;
  const maxDate = new Date();
  const [date, setDate] = React.useState(releaseTime ? linuxTimestampToDate(releaseTime) : new Date());

  const onChange = (value) => {
    if (!value) {
      if (releaseTime) {
        // Reset to claim's original release time.
        setDate(linuxTimestampToDate(releaseTime));
        updatePublishForm({ releaseTimeEdited: undefined });
      } else {
        // Reset to "now".
        const newDate = new Date();
        setDate(newDate);
        updatePublishForm({ releaseTimeEdited: dateToLinuxTimestamp(newDate) });
      }
    } else {
      // Set to user-defined.
      const newDate = value;
      setDate(newDate);
      updatePublishForm({ releaseTimeEdited: dateToLinuxTimestamp(newDate) });
    }
  };

  return (
    <div className="form-field-date-picker">
      <label>Release date</label>
      <DateTimePicker
        className="date-picker-input"
        calendarClassName="form-field-calendar"
        onChange={onChange}
        value={date}
        maxDate={maxDate}
        format="y-MM-dd h:mm a"
        disableClock
      />
    </div>
  );
};

export default PublishReleaseDate;
