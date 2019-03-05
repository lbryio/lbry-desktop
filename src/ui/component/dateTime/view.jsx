// @flow
import React from 'react';
import moment from 'moment';

type Props = {
  date?: number | {},
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
    // this.refreshDate(this.props);
  }

  componentWillReceiveProps() {
    // this.refreshDate(props);
  }

  // Removing this for performance reasons. Can be un-commented once block_show is better with large numbers of calls
  // Or the date is included in the claim
  //
  // refreshDate(props: Props) {
  //   const { block, date, fetchBlock } = props;
  //   if (block && date === undefined) {
  //     fetchBlock(block);
  //   }
  // }

  render() {
    const { date, formatOptions, timeAgo } = this.props;
    const show = this.props.show || DateTime.SHOW_BOTH;
    const locale = i18n.getLocale();

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
