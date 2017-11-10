import React from "react";
import Link from "component/link";
import WunderBar from "component/wunderbar";

export const Header = props => {
  const {
    balance,
    back,
    downloadUpgrade,
    forward,
    isBackDisabled,
    isForwardDisabled,
    navigate,
    publish,
    upgradeLabel,
    upgradeSkipped,
  } = props;
  return (
    <header id="header">
      <div className="header__item">
        <Link
          onClick={back}
          disabled={isBackDisabled}
          button="alt button--flat"
          icon="icon-arrow-left"
          title={__("Back")}
        />
      </div>
      <div className="header__item">
        <Link
          onClick={forward}
          disabled={isForwardDisabled}
          button="alt button--flat"
          icon="icon-arrow-right"
          title={__("Forward")}
        />
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
          className="no-underline"
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
      <rem>HEY I'M HER E</rem>
      {upgradeSkipped
        ? <div className="header__item">
            <Link
              onClick={() => downloadUpgrade()}
              button="primary button--flat"
              icon="icon-upload"
              label={upgradeLabel}
            />
          </div>
        : ""}
    </header>
  );
};

export default Header;
