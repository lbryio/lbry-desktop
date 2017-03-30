import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import {FileActions} from '../component/file-actions.js';
import {Thumbnail, TruncatedText, CreditAmount} from '../component/common.js';

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
      <section className={'notice' + (this.props.isError ? ' notice--error' : '')}>
        {this.props.children}
      </section>
    );
  },
});

export default Notice;