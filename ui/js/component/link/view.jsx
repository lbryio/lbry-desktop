import React from "react";
import { Icon } from "component/common.js";

const Link = props => {
  const {
    href,
    title,
    style,
    label,
    icon,
    button,
    disabled,
    children,
    navigate,
    navigateParams,
    doNavigate,
  } = props;

  const className =
    (props.className || "") +
    (!props.className && !button ? "button-text" : "") + // Non-button links get the same look as text buttons
    (button ? " button-block button-" + button + " button-set-item" : "") +
    (disabled ? " disabled" : "");

  const onClick = !props.onClick && navigate
    ? () => {
        doNavigate(navigate, navigateParams || {});
      }
    : props.onClick;

  let content;
  if (children) {
    content = children;
  } else {
    content = (
      <span {...("button" in props ? { className: "button__content" } : {})}>
        {"icon" in props ? <Icon icon={icon} fixed={true} /> : null}
        {label ? <span className="link-label">{label}</span> : null}
      </span>
    );
  }

  return (
    <a
      className={className}
      href={href || "javascript:;"}
      title={title}
      onClick={onClick}
      {...("style" in props ? { style: style } : {})}
    >
      {content}
    </a>
  );
};

export default Link;
