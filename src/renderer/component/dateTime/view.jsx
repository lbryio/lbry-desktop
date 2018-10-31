// @flow
import React from 'react';
import moment from 'moment';

type Props = {
  date?: number,
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

  componentWillMount() {
    this.refreshDate(this.props);
  }

  componentWillReceiveProps(props) {
    this.refreshDate(props);
  }

  refreshDate(props) {
    const { block, date, fetchBlock } = props;
    if (block && date === undefined) {
      fetchBlock(block);
    }
  }

  render() {
    const { date, formatOptions, timeAgo } = this.props;
    const show = this.props.show || DateTime.SHOW_BOTH;
    const locale = app.i18n.getLocale();

    // If !date, it's currently being fetched

    if (timeAgo) {
      return date ? <span>{moment(date).from(moment())}</span> : <span />;
    }

    return (
      <span>
        {date &&
          (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_DATE) &&
          date.toLocaleDateString([locale, 'en-US'], formatOptions)}
        {show === DateTime.SHOW_BOTH && ' '}
        {date &&
          (show === DateTime.SHOW_BOTH || show === DateTime.SHOW_TIME) &&
          date.toLocaleTimeString()}
        {!date && '...'}
      </span>
    );
  }
}

export default DateTime;
