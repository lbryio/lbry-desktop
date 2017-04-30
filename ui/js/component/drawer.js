import lbry from '../lbry.js';
import React from 'react';
import {Link} from './link.js';

var DrawerItem = React.createClass({
  getDefaultProps: function() {
    return {
      subPages: [],
    };
  },
  render: function() {
    var isSelected = (this.props.viewingPage == this.props.href.substr(1) ||
                      this.props.subPages.indexOf(this.props.viewingPage) != -1);
    return <Link {...this.props} className={ 'drawer-item ' + (isSelected ? 'drawer-item-selected' : '') } />
  }
});

var drawerImageStyle = { //@TODO: remove this, img should be properly scaled once size is settled
  height: '36px'
};

var Drawer = React.createClass({
  _balanceSubscribeId: null,

  handleLogoClicked: function(event) {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      window.location.href = '?developer'
      event.preventDefault();
    }
  },
  getInitialState: function() {
    return {
      balance: 0,
    };
  },
  componentDidMount: function() {
    this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
      this.setState({
        balance: balance
      });
    });
  },
  componentWillUnmount: function() {
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  },
  render: function() {
    return (
      <nav id="drawer">
        <div id="drawer-handle">
          <Link title="Close" onClick={this.props.onCloseDrawer} icon="icon-bars" className="close-drawer-link"/>
          <a href="?discover" onMouseUp={this.handleLogoClicked}><img src={lbry.imagePath("lbry-dark-1600x528.png")} style={drawerImageStyle}/></a>
        </div>
        <DrawerItem href='?discover' viewingPage={this.props.viewingPage} label="Discover" icon="icon-search"  />
        <DrawerItem href='?publish' viewingPage={this.props.viewingPage} label="Publish" icon="icon-upload" />
        <DrawerItem href='?downloaded' subPages={['published']} viewingPage={this.props.viewingPage}  label="My Files" icon='icon-cloud-download' />
        <DrawerItem href="?wallet" subPages={['send', 'receive', 'rewards']} viewingPage={this.props.viewingPage}  label="My Wallet" badge={lbry.formatCredits(this.state.balance) } icon="icon-bank" />
        <DrawerItem href='?settings' viewingPage={this.props.viewingPage}  label="Settings" icon='icon-gear' />
        <DrawerItem href='?help' viewingPage={this.props.viewingPage}  label="Help" icon='icon-question-circle' />
      </nav>
    );
  }
});


export default Drawer;
