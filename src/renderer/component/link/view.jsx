import React from "react";
import Icon from "component/icon";

const Link = props => {
  const {
    href,
    title,
    style,
    label,
    icon,
    iconRight,
    button,
    disabled,
    children,
    navigate,
    navigateParams,
    doNavigate,
    className,
  } = props;

  const combinedClassName =
    (className || "") +
    (!className && !button ? "button-text" : "") + // Non-button links get the same look as text buttons
    (button ? " button-block button-" + button + " button-set-item" : "") +
    (disabled ? " disabled" : "");

  const onClick =
    !props.onClick && navigate
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
        {icon ? <Icon icon={icon} fixed={true} /> : null}
        {label ? <span className="link-label">{label}</span> : null}
        {iconRight ? <Icon icon={iconRight} fixed={true} /> : null}
      </span>
    );
  }

  return (
    <a
      className={combinedClassName}
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
