import React from "react";
import PropTypes from "prop-types";
import { clipboard } from "electron";
import Link from "component/link";
import classnames from "classnames";

export default class Address extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._inputElem = null;
  }

  render() {
    const { address, showCopyButton, doShowSnackBar } = this.props;

    return (
      <div className="form-field form-field--address">
        <input
          className={classnames("input-copyable", {
            "input-copyable--with-copy-btn": showCopyButton,
          })}
          type="text"
          ref={input => {
            this._inputElem = input;
          }}
          onFocus={() => {
            this._inputElem.select();
          }}
          readOnly="readonly"
          value={address || ""}
        />
        {showCopyButton && (
          <span className="header__item">
            <Link
              button="alt button--flat"
              icon="clipboard"
              onClick={() => {
                clipboard.writeText(address);
                doShowSnackBar({ message: __("Address copied") });
              }}
            />
          </span>
        )}
      </div>
    );
  }
}
