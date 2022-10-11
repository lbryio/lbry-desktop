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
  navigateTarget?: string,
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
  requiresAuth?: boolean,
  requiresChannel?: boolean,
  hasChannels: boolean,
  myref: any,
  dispatch: any,
  'aria-label'?: string,
  user: ?User,
  doHideModal: () => void,
};

// use forwardRef to allow consumers to pass refs to the button content if they want to
// flow requires forwardRef have default type arguments passed to it
const Button = forwardRef<any, {}>((props: Props, ref: any) => {
  const {
    type = 'button',
    onClick: onClickProp,
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
    navigateTarget,
    className,
    description,
    button,
    iconSize,
    iconColor,
    activeClass,
    emailVerified,
    requiresAuth,
    requiresChannel,
    hasChannels,
    myref,
    dispatch, // <button> doesn't know what to do with dispatch
    pathname,
    user,
    authSrc,
    doHideModal,
    ...otherProps
  } = props;

  const disable = disabled || (user === null && requiresAuth);
  const onClick = disabled ? undefined : onClickProp;

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

  // check if the link is for odysee.com
  function isAnOdyseeLink(urlString) {
    return (
      urlString && (urlString.indexOf('https://odysee.com') !== -1 || urlString.indexOf('http://odysee.com') !== -1)
    );
  }

  // if it's an internal link we won't open a new tab
  const isAnInternalLink = (href || navigate) && (isAnOdyseeLink(href) || isAnOdyseeLink(navigate));

  if (href || (navigate && navigate.startsWith('http'))) {
    // TODO: replace the below with an outbound link tracker for matomo
    return (
      <a
        target={navigateTarget || (isAnInternalLink ? '' : '_blank')}
        rel="noopener noreferrer"
        href={href || navigate}
        className={combinedClassName}
        title={title}
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled} // is there a reason this wasn't here before?
        ref={combinedRef}
        {...otherProps}
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

  if ((requiresAuth && !emailVerified) || (requiresChannel && !hasChannels)) {
    // requiresChannel can be used for both requiresAuth and requiresChannel,
    // since if the button requiresChannel, it also implies it requiresAuth in order to proceed
    // so using requiresChannel means: unauth users are sent to signup, auth users to create channel
    const page = !emailVerified ? PAGES.AUTH : PAGES.CHANNEL_NEW;
    let redirectUrl = `/$/${page}?redirect=${pathname}`;

    if (authSrc) {
      redirectUrl += `&src=${authSrc}`;
    }

    return (
      <NavLink
        exact
        onClick={(e) => {
          e.stopPropagation();
          // in case the redirect came from a modal, it will stay open on the
          // sign up page, so close it to make the sign up form seen
          doHideModal();
        }}
        to={redirectUrl}
        title={title || defaultTooltip}
        disabled={disable}
        className={combinedClassName}
        activeClassName={activeClass}
        aria-label={ariaLabel}
        ref={combinedRef}
        {...otherProps}
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
      ref={combinedRef}
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
