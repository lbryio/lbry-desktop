import React from "react";

class DateTime extends React.PureComponent {
  static SHOW_DATE = "date";
  static SHOW_TIME = "time";
  static SHOW_BOTH = "both";

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
    const { date, formatOptions } = this.props;
    const show = this.props.show || DateTime.SHOW_BOTH;

    return (
      <span>
        {date &&
          (show == DateTime.SHOW_BOTH || show === DateTime.SHOW_DATE) &&
          date.toLocaleDateString()}
        {show == DateTime.SHOW_BOTH && " "}
        {date &&
          (show == DateTime.SHOW_BOTH || show === DateTime.SHOW_TIME) &&
          date.toLocaleTimeString()}
      </span>
    );
  }
}

export default DateTime;
