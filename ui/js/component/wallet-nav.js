import {SubHeader} from '../component/sub-header.js';

export let WalletNav = React.createClass({
  render: function () {
    return <SubHeader modifier="constrained" viewingPage={this.props.viewingPage} links={{
     '?wallet': 'Overview',
       '?send': 'Send',
       '?receive': 'Receive',
       '?rewards': 'Rewards'
     }} />;
  }
});