import React from "react";
import PropTypes from "prop-types";
import * as icons from "constants/icons";

export default class Icon extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    fixed: PropTypes.bool,
  };

  static defaultProps = {
    fixed: false,
  };

  getIconClass() {
    const { icon } = this.props;

    return icon.startsWith("icon-") ? icon : "icon-" + icon;
  }

  getIconTitle() {
    switch (this.props.icon) {
      case icons.FEATURED:
        return __("Watch this and earn rewards.");
      case icons.LOCAL:
        return __("You have a copy of this file.");
      default:
        return "";
    }
  }

  render() {
    const className = this.getIconClass(),
      title = this.getIconTitle();

    const spanClassName =
      "icon " + className + (this.props.fixed ? " icon-fixed-width " : "");

    return <span className={spanClassName} title={title} />;
  }
}
