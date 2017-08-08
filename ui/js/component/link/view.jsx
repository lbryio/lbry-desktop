import React from "react";
import { Icon } from "component/common.js";

const Link = props => {
  const {
    href,
    title,
    onClick,
    style,
    label,
    icon,
    badge,
    button,
    disabled,
    children,
  } = props;

  const className =
    (props.className || "") +
    (!props.className && !props.button ? "button-text" : "") + // Non-button links get the same look as text buttons
    (props.button
      ? " button-block button-" + props.button + " button-set-item"
      : "") +
    (props.disabled ? " disabled" : "");

  let content;
  if (children) {
    content = children;
  } else {
    content = (
      <span {...("button" in props ? { className: "button__content" } : {})}>
        {"icon" in props ? <Icon icon={icon} fixed={true} /> : null}
        {label ? <span className="link-label">{label}</span> : null}
        {"badge" in props ? <span className="badge">{badge}</span> : null}
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
