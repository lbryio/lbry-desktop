// @flow
import * as React from 'react';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';
import { OutboundLink } from 'react-ga';

type Props = {
  onClick: ?(any) => any,
  href: ?string,
  title: ?string,
  label: ?string,
  icon: ?string,
  iconRight: ?string,
  disabled: ?boolean,
  children: ?React.Node,
  navigate: ?string,
  className: ?string,
  description: ?string,
  type: string,
  button: ?string, // primary, secondary, alt, link
  iconColor?: string,
  iconSize?: number,
  constrict: ?boolean, // to shorten the button and ellipsis, only use for links
  activeClass?: string,
};

class Button extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'button',
  };

  render() {
    const {
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
      type,
      iconColor,
      iconSize,
      constrict,
      activeClass,
      ...otherProps
    } = this.props;

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

    return path ? (
      <NavLink
        exact
        to={path}
        title={title}
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
        title={title}
        aria-label={description || label || title}
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...otherProps}
      >
        {content}
      </button>
    );
  }
}

export default Button;
