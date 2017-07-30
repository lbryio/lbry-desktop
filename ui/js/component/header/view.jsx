import React from "react";
import Link from "component/link";
import WunderBar from "component/wunderbar";

export const Header = props => {
  const { balance, back, navigate, publish } = props;

  return (
    <header id="header">
      <div className="header__item">
        <Link onClick={back} button="alt button--flat" icon="icon-arrow-left" title={__("Back")} />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate("/discover")}
          button="alt button--flat"
          icon="icon-home"
          title={__("Discover Content")}
        />
      </div>
      <div className="header__item header__item--wunderbar">
        <WunderBar />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate("/wallet")}
          button="text"
          icon="icon-bank"
          label={balance}
          title={__("Wallet")}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate("/publish")}
          button="primary button--flat"
          icon="icon-upload"
          label={publish}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate("/downloaded")}
          button="alt button--flat"
          icon="icon-folder"
          title={__("Downloads and Publishes")}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={() => navigate("/settings")}
          button="alt button--flat"
          icon="icon-gear"
          title={__("Settings")}
        />
      </div>
    </header>
  );
};

export default Header;
