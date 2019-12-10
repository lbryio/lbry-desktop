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
      const numberOfYearsSincePublish = moment().diff(date, 'years');

      if (numberOfYearsSincePublish === 1) {
        return <span>{__('%numberOfYearsSincePublish% year ago', { numberOfYearsSincePublish })}</span>;
      } else if (numberOfYearsSincePublish > 1) {
        return <span>{__('%numberOfYearsSincePublish% years ago', { numberOfYearsSincePublish })}</span>;
      }

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
