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

  static defaultProps = {
    formatOptions: {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  };

  render() {
    const { date, formatOptions, timeAgo } = this.props;
    const show = this.props.show || DateTime.SHOW_BOTH;

    if (timeAgo) {
      return date ? <span>{moment(date).from(moment())}</span> : <span />;
    }

    return (
      <span>
        {date &&
          (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_DATE) &&
          date.toLocaleDateString(undefined, formatOptions)}
        {show === DateTime.SHOW_BOTH && ' '}
        {date && (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_TIME) && date.toLocaleTimeString()}
        {!date && '...'}
      </span>
    );
  }
}

export default DateTime;
