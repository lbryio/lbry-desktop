import lbry from 'lbry.js';
import React from 'react';
import Link from 'component/link';

const DrawerItem = (props) => {
  const {
    currentPage,
    href,
    subPages,
    label,
    linkClick,
    icon,
  } = props
  const isSelected = (
    currentPage == href.substr(1) ||
    (subPages && subPages.indexOf(currentPage) != -1)
  )

  return <Link icon={icon} label={label} onClick={() => linkClick(href)} className={ 'drawer-item ' + (isSelected ? 'drawer-item-selected' : '') } />
}

var drawerImageStyle = { //@TODO: remove this, img should be properly scaled once size is settled
  height: '36px'
};

class Drawer extends React.Component {
  constructor(props) {
    super(props)
    this._balanceSubscribeId = null
  }

  componentDidMount() {
    const { updateBalance } = this.props

    this._balanceSubscribeId = lbry.balanceSubscribe(function(balance) {
      updateBalance(balance)
    }.bind(this));
  }
  componentWillUnmount() {
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  }

  render() {
    const {
      closeDrawerClick,
      logoClick,
      currentPage,
      balance,
    } = this.props

    return(<nav id="drawer">
      <div id="drawer-handle">
        <Link title="Close" onClick={closeDrawerClick} icon="icon-bars" className="close-drawer-link"/>
        <a href="discover" onMouseUp={logoClick}><img src={lbry.imagePath("lbry-dark-1600x528.png")} style={drawerImageStyle}/></a>
      </div>
      <DrawerItem {...this.props} href='discover' label="Discover" icon="icon-search"  />
      <DrawerItem {...this.props} href='publish' label="Publish" icon="icon-upload" />
      <DrawerItem {...this.props} href='downloaded' subPages={['published']} label="My Files" icon='icon-cloud-download' />
      <DrawerItem {...this.props} href="wallet" subPages={['send', 'receive', 'claim', 'referral']} label="My Wallet" badge={lbry.formatCredits(balance) } icon="icon-bank" />
      <DrawerItem {...this.props} href='settings' label="Settings" icon='icon-gear' />
      <DrawerItem {...this.props} href='help' label="Help" icon='icon-question-circle' />
    </nav>)
  }
}

export default Drawer;
