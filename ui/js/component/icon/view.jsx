import React from "react";
import * as icons from "constants/icons";

export default class Icon extends React.PureComponent {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    fixed: React.PropTypes.bool,
    className: React.PropTypes.string,
  };

  static defaultProps = {
    fixed: false,
  };

  getIconInfo() {
    if (this.props.icon.startsWith("icon-")) {
      // Old style where FA icon class is passed in directly
      return { className: this.props.icon, title: "" };
    }

    switch (this.props.icon) {
      case icons.FEATURED:
        return {
          className: "icon-rocket",
          title: "Watch content with this icon to earn weekly rewards.",
        };
      case icons.LOCAL:
        return {
          className: "icon-folder",
          title: "You have a copy of this file.",
        };
      default:
        throw new Error(`Unknown icon type "${this.props.icon}"`);
    }
  }

  render() {
    const { className, title } = this.getIconInfo();

    const spanClassName =
      "icon " +
      className +
      (this.props.fixed ? " icon-fixed-width " : "") +
      (this.props.className || "");

    return <span className={spanClassName} title={title} />;
  }
}
