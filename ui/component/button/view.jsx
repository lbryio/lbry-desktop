// @flow
import type { Node } from 'react';
import React, { forwardRef, useRef } from 'react';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { formatLbryUrlForWeb } from 'util/url';
import * as PAGES from 'constants/pages';
import useCombinedRefs from 'effects/use-combined-refs';

type Props = {
  id: ?string,
  href: ?string,
  title: ?string,
  label: ?string,
  largestLabel: ?string,
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
  activeClass?: string,
  innerRef: ?any,
  authSrc?: string,
  // Events
  onClick: ?(any) => any,
  onMouseEnter: ?(any) => any,
  onMouseLeave: ?(any) => any,
  pathname: string,
  emailVerified: boolean,
  requiresAuth: ?boolean,
  myref: any,
  dispatch: any,
  'aria-label'?: string,
  user: ?User,
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
    largestLabel,
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
    activeClass,
    emailVerified,
    requiresAuth,
    myref,
    dispatch, // <button> doesn't know what to do with dispatch
    pathname,
    user,
    authSrc,
    ...otherProps
  } = props;

  const disable = disabled || (user === null && requiresAuth);

  const combinedClassName = classnames(
    'button',
    button
      ? {
          'button--primary': button === 'primary',
          'button--secondary': button === 'secondary',
          'button--alt': button === 'alt',
          'button--inverse': button === 'inverse',
          'button--close': button === 'close',
          'button--disabled': disable,
          'button--link': button === 'link',
        }
      : 'button--no-style',
    className
  );

  const innerRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, innerRef, myref);
  const size = iconSize || (!label && !children) ? 18 : undefined; // Fall back to default

  // Label can be a string or object ( use title instead )
  const ariaLabel = description || (typeof label === 'string' ? label : title);

  const content = (
    <span className="button__content">
      {icon && <Icon icon={icon} iconColor={iconColor} size={iconSize} />}

      {!largestLabel && label && (
        <span dir="auto" className="button__label">
          {label}
        </span>
      )}

      {/* largestLabel is used when a single button has two different labels based on hover state */}
      {largestLabel && (
        <div dir="auto" className="button__label" style={{ position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, 0%)`,
            }}
          >
            <span style={{ visibility: 'hidden' }}>
              {largestLabel || label}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <span style={{ visibility: 'visible' }}>{label}</span>
              </div>
            </span>
          </div>
        </div>
      )}

      {children && children}
      {iconRight && <Icon icon={iconRight} iconColor={iconColor} size={iconSize || size} />}
    </span>
  );

  if (href || (navigate && navigate.startsWith('http'))) {
    // TODO: replace the below with an outbound link tracker for matomo
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={href || navigate}
        className={combinedClassName}
        title={title}
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled} // is there a reason this wasn't here before?
      >
        {content}
      </a>
    );
  }

  // Handle lbry:// uris passed in, or already formatted web urls
  let path = navigate;
  if (path) {
    if (path.startsWith('lbry://')) {
      path = formatLbryUrlForWeb(path);
    } else if (!path.startsWith('/')) {
      // Force a leading slash so new paths aren't appended on to the current path
      path = `/${path}`;
    }
  }

  // Try to generate a tooltip using available text and display it through
  // the 'title' mechanism, but only if it isn't being used.
  let defaultTooltip;
  if (!title) {
    if (props['aria-label']) {
      defaultTooltip = props['aria-label'];
    } else if (description) {
      defaultTooltip = description;
    }
  }

  if (requiresAuth && !emailVerified) {
    let redirectUrl = `/$/${PAGES.AUTH}?redirect=${pathname}`;

    if (authSrc) {
      redirectUrl += `&src=${authSrc}`;
    }

    return (
      <NavLink
        exact
        onClick={(e) => {
          e.stopPropagation();
        }}
        to={redirectUrl}
        title={title || defaultTooltip}
        disabled={disable}
        className={combinedClassName}
        activeClassName={activeClass}
        aria-label={ariaLabel}
      >
        {content}
      </NavLink>
    );
  }

  return path ? (
    <NavLink
      exact
      to={path}
      title={title || defaultTooltip}
      disabled={disable}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
      className={combinedClassName}
      activeClassName={activeClass}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {content}
    </NavLink>
  ) : (
    <button
      ref={combinedRef}
      title={title || defaultTooltip}
      aria-label={ariaLabel}
      className={combinedClassName}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      disabled={disable}
      type={type}
      {...otherProps}
    >
      {content}
    </button>
  );
});

export default Button;
