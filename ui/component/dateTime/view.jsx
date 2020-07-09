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

  static getTimeAgoStr(date: any) {
    const suffixList = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', ''];
    var duration = 0;

    for (var i = 0; i < suffixList.length; ++i) {
      // moment() is very liberal with it's rounding.
      // Always round down dates for better youtube parity.
      duration = Math.floor(moment().diff(date, suffixList[i]));
      if (duration > 0) {
        break;
      }
    }

    if (i === suffixList.length) {
      // This should never happen since we are handling up to 'seconds' now,
      // but display the English version just in case it does.
      return moment(date).from(moment());
    }

    // Strip off the 's' for the singular suffix, construct the string ID,
    // then load the localized version.
    const suffix = duration === 1 ? suffixList[i].substr(0, suffixList[i].length - 1) : suffixList[i];
    const strId = '%duration% ' + suffix + ' ago';
    return __(strId, { duration });
  }

  render() {
    const { date, timeAgo, show } = this.props;

    if (timeAgo) {
      if (!date) {
        return null;
      }

      return <span>{DateTime.getTimeAgoStr(date)}</span>;
    }

    return (
      <span>
        {date && show === DateTime.SHOW_DATE && moment(date).format('MMMM Do, YYYY')}
        {date && show === DateTime.SHOW_TIME && moment(date).format('hh:mm A')}
        {!date && '...'}
      </span>
    );
  }
}

export default DateTime;
