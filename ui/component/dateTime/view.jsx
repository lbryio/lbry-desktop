// @flow
import { getTimeAgoStr } from 'util/time';
import moment from 'moment';
import React from 'react';

const DEFAULT_MIN_UPDATE_DELTA_MS = 60 * 1000;

type State = {
  lastRenderTime: Date,
};

type Props = {
  clock24h?: boolean,
  date?: any,
  genericSeconds?: boolean,
  minUpdateDeltaMs?: number,
  showFutureDate?: boolean,
  timeAgo?: boolean,
  type?: string,
};

class DateTime extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      lastRenderTime: new Date(),
    };
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    if (
      moment(this.props.date).diff(moment(nextProps.date)) !== 0 ||
      this.props.clock24h !== nextProps.clock24h ||
      this.props.timeAgo !== nextProps.timeAgo ||
      this.props.minUpdateDeltaMs !== nextProps.minUpdateDeltaMs ||
      this.props.type !== nextProps.type
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

    if (timeAgo) this.setState({ lastRenderTime: new Date() });
  }

  render() {
    const { clock24h, date, genericSeconds, showFutureDate, timeAgo, type } = this.props;

    const clockFormat = clock24h ? 'HH:mm' : 'hh:mm A';

    return (
      <span className="date_time" title={timeAgo && moment(date).format(`MMMM Do, YYYY ${clockFormat}`)}>
        {date
          ? timeAgo
            ? getTimeAgoStr(date, showFutureDate, genericSeconds)
            : moment(date).format(type === 'date' ? 'MMMM Do, YYYY' : clockFormat)
          : '...'}
      </span>
    );
  }
}

export default DateTime;
