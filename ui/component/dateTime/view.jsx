// @flow
import React from 'react';
import moment from 'moment';

const DEFAULT_MIN_UPDATE_DELTA_MS = 60 * 1000;

type Props = {
  date?: any,
  timeAgo?: boolean,
  formatOptions?: {},
  show?: string,
  clock24h?: boolean,
  minUpdateDeltaMs?: number,
};

type State = {
  lastRenderTime: Date,
};

class DateTime extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lastRenderTime: new Date(),
    };
  }

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
    let strId = '%duration% ' + suffix + ' ago';

    if (!suffix) {
      strId = 'Just now';
    }

    return __(strId, { duration });
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    if (
      moment(this.props.date).diff(moment(nextProps.date)) !== 0 ||
      this.props.clock24h !== nextProps.clock24h ||
      this.props.timeAgo !== nextProps.timeAgo ||
      this.props.minUpdateDeltaMs !== nextProps.minUpdateDeltaMs ||
      this.props.show !== nextProps.show
    ) {
      return true;
    }

    if (this.props.timeAgo && nextProps.timeAgo) {
      const minUpdateDeltaMs = this.props.minUpdateDeltaMs || DEFAULT_MIN_UPDATE_DELTA_MS;
      const prev = moment(this.state.lastRenderTime);
      const curr = moment(new Date());
      const deltaMs = curr.diff(prev);

      if (deltaMs > minUpdateDeltaMs) {
        return true;
      }
    }

    return false;
  }

  componentDidUpdate() {
    const { timeAgo } = this.props;
    if (timeAgo) {
      this.setState({ lastRenderTime: new Date() });
    }
  }

  render() {
    const { date, timeAgo, show, clock24h } = this.props;

    let clockFormat = 'hh:mm A';
    if (clock24h) {
      clockFormat = 'HH:mm';
    }

    if (timeAgo) {
      if (!date) {
        return null;
      }

      return <span title={moment(date).format(`MMMM Do, YYYY ${clockFormat}`)}>{DateTime.getTimeAgoStr(date)}</span>;
    }

    return (
      <span>
        {date && show === DateTime.SHOW_DATE && moment(date).format('MMMM Do, YYYY')}
        {date && show === DateTime.SHOW_TIME && moment(date).format(clockFormat)}
        {!date && '...'}
      </span>
    );
  }
}

export default DateTime;
