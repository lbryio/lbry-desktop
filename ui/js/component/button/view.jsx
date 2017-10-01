import React from "react";
import { Icon } from "component/common.js";
import styles from "./button.module.css";

class Button extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, label, title, disabled, action, type } = this.props;
    const className = styles[type] || styles.button;

    const content = (
      <span className={styles.content}>
        {icon && <Icon icon={icon} fixed={true} />}
        {label && <span>{label}</span>}
      </span>
    );

    const buttonProps = { className, title, disabled };

    return (
      <button onClick={action} {...buttonProps}>
        {content}
      </button>
    );
  }
}

export default Button;
