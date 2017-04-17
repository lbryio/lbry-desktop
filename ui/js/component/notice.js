import React from 'react';

export const Notice = React.createClass({
  propTypes: {
    isError: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      isError: false,
    };
  },
  render: function() {
    return (
      <section className={'notice ' + (this.props.isError ? 'notice--error ' : '') + (this.props.className || '')}>
        {this.props.children}
      </section>
    );
  },
});

export default Notice;