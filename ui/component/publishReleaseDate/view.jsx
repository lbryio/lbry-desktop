// @flow
import React, { useCallback } from 'react';
import DatePicker from 'react-date-picker';
import Card from 'component/common/card';

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
    <Card
      className="card--enable-overflow"
      actions={
        <div>
          <label className="form-field-date-picker-label">Release date</label>
          <DatePicker
            className="date-picker-input"
            calendarClassName="form-field-date-picker"
            onChange={onChange}
            value={dateOrToday(releaseTime)}
            maxDate={maxDate}
            format="dd/MM/y"
          />
        </div>
      }
    />
  );
};

export default PublishReleaseDate;
