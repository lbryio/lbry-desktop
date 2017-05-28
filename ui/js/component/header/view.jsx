import React from 'react';
import Link from 'component/link';
import WunderBar from 'component/wunderbar';

export const Header = (props) => {
  const {
    balance,
    back,
    navigate,
    publish,
  } = props

  return <header id="header">
    <div className="header__item">
      <Link onClick={back} button="alt button--flat" icon="icon-arrow-left" />
    </div>
    <div className="header__item">
      <Link onClick={() => navigate('/discover')} button="alt button--flat" icon="icon-home" />
    </div>
    <div className="header__item header__item--wunderbar">
      <WunderBar/>
    </div>
    <div className="header__item">
      <Link onClick={() => navigate('/wallet')}  button="text" icon="icon-bank" label={balance} ></Link>
    </div>
    <div className="header__item">
      <Link onClick={() => navigate('/publish')} button="primary button--flat" icon="icon-upload" label={publish} />
    </div>
    <div className="header__item">
      <Link onClick={() => navigate('/downloaded')} button="alt button--flat" icon="icon-folder" />
    </div>
    <div className="header__item">
      <Link onClick={() => navigate('/settings')}  button="alt button--flat" icon="icon-gear" />
    </div>
  </header>
}

export default Header;
