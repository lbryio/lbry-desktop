// @flow
import React from 'react';
import moment from 'moment';

type Props = {
  date?: any,
  timeAgo?: boolean,
  formatOptions: {},
  show?: string,
};

class DateTime extends React.PureComponent<Props> {
  static SHOW_DATE = 'date';
  static SHOW_TIME = 'time';
  static SHOW_BOTH = 'both';

  render() {
    const { date, timeAgo } = this.props;
    const show = this.props.show || DateTime.SHOW_BOTH;

    if (timeAgo) {
      if (!date) {
        return null;
      }

      // Moment is very liberal with it's rounding
      // Wait to show "two years ago" until it's actually been two years (or higher)
      const numberOfYearsSincePublish = Math.floor(moment().diff(date, 'years'));

      if (numberOfYearsSincePublish === 1) {
        return <span>{__('%numberOfYearsSincePublish% year ago', { numberOfYearsSincePublish })}</span>;
      } else if (numberOfYearsSincePublish > 1) {
        return <span>{__('%numberOfYearsSincePublish% years ago', { numberOfYearsSincePublish })}</span>;
      }

      const numberOfMonthsSincePublish = Math.floor(moment().diff(date, 'months'));
      if (numberOfMonthsSincePublish === 1) {
        return <span>{__('%numberOfMonthsSincePublish% month ago', { numberOfMonthsSincePublish })}</span>;
      } else if (numberOfMonthsSincePublish > 1) {
        return <span>{__('%numberOfMonthsSincePublish% months ago', { numberOfMonthsSincePublish })}</span>;
      }

      const numberOfDaysSincePublish = Math.floor(moment().diff(date, 'days'));
      if (numberOfDaysSincePublish === 1) {
        return <span>{__('%numberOfDaysSincePublish% day ago', { numberOfDaysSincePublish })}</span>;
      } else if (numberOfDaysSincePublish > 1) {
        return <span>{__('%numberOfDaysSincePublish% days ago', { numberOfDaysSincePublish })}</span>;
      }

      // "just now", "a few minutes ago"
      return <span>{moment(date).from(moment())}</span>;
    }

    return (
      <span>
        {date && (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_DATE) && moment(date).format('MMMM Do, YYYY')}
        {show === DateTime.SHOW_BOTH && ' '}
        {date && (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_TIME) && date.toLocaleTimeString()}
        {!date && '...'}
      </span>
    );
  }
}

export default DateTime;
