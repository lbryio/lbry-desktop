// @flow
import type { Node } from 'react';
import React, { forwardRef } from 'react';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';
import { OutboundLink } from 'react-ga';
import * as PAGES from 'constants/pages';

type Props = {
  id: ?string,
  href: ?string,
  title: ?string,
  label: ?string,
  icon: ?string,
  iconRight: ?string,
  disabled: ?boolean,
  children: ?Node,
  navigate: ?string,
  className: ?string,
  description: ?string,
  type: string,
  button: ?string, // primary, secondary, alt, link
  iconSize?: number,
  iconColor?: string,
  constrict: ?boolean, // to shorten the button and ellipsis, only use for links
  activeClass?: string,
  innerRef: ?any,
  // Events
  onClick: ?(any) => any,
  onMouseEnter: ?(any) => any,
  onMouseLeave: ?(any) => any,
  pathname: string,
  emailVerified: boolean,
  requiresAuth: ?boolean,
  myref: any,
  dispatch: any,
};

// use forwardRef to allow consumers to pass refs to the button content if they want to
// flow requires forwardRef have default type arguments passed to it
const Button = forwardRef<any, {}>((props: Props, ref: any) => {
  const {
    type = 'button',
    onClick,
    href,
    title,
    label,
    icon,
    // This should rarely be used. Regular buttons should just use `icon`
    // `iconRight` is used for the header (home) button with the LBRY icon and external links that are displayed inline
    iconRight,
    disabled,
    children,
    navigate,
    className,
    description,
    button,
    iconSize,
    iconColor,
    constrict,
    activeClass,
    emailVerified,
    requiresAuth,
    myref,
    dispatch, // <button> doesn't know what to do with dispatch
    pathname,
    ...otherProps
  } = props;

  const combinedClassName = classnames(
    'button',
    button
      ? {
          'button--primary': button === 'primary',
          'button--secondary': button === 'secondary',
          'button--alt': button === 'alt',
          'button--inverse': button === 'inverse',
          'button--close': button === 'close',
          'button--disabled': disabled,
          'button--link': button === 'link',
          'button--constrict': constrict,
        }
      : 'button--no-style',
    className
  );

  const content = (
    <span className="button__content">
      {icon && <Icon icon={icon} iconColor={iconColor} size={iconSize} />}
      {label && <span className="button__label">{label}</span>}
      {children && children}
      {iconRight && <Icon icon={iconRight} iconColor={iconColor} size={iconSize} />}
    </span>
  );

  if (href) {
    return (
      <OutboundLink eventLabel="outboundClick" to={href} target="_blank" className={combinedClassName}>
        {content}
      </OutboundLink>
    );
  }

  // Handle lbry:// uris passed in, or already formatted web urls
  let path = navigate;
  if (path) {
    if (path.startsWith('lbry://')) {
      path = formatLbryUriForWeb(path);
    } else if (!path.startsWith('/')) {
      // Force a leading slash so new paths aren't appended on to the current path
      path = `/${path}`;
    }
  }

  if (requiresAuth && !emailVerified) {
    return (
      <NavLink
        ref={ref}
        exact
        to={`/$/${PAGES.AUTH}?redirect=${pathname}`}
        title={title}
        disabled={disabled}
        className={combinedClassName}
        activeClassName={activeClass}
      >
        {content}
      </NavLink>
    );
  }

  return path ? (
    <NavLink
      ref={ref}
      exact
      to={path}
      title={title}
      disabled={disabled}
      onClick={e => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
      className={combinedClassName}
      activeClassName={activeClass}
    >
      {content}
    </NavLink>
  ) : (
    <button
      ref={ref}
      title={title}
      aria-label={description || label || title}
      className={combinedClassName}
      onClick={e => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      disabled={disabled}
      type={type}
      {...otherProps}
    >
      {content}
    </button>
  );
});

export default Button;
