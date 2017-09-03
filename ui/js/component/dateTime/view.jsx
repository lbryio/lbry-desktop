import React from "react";

class DateTime extends React.PureComponent {
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
    const { date } = this.props;

    return <span>{date && date.toLocaleString()}</span>;
  }
}

export default DateTime;
