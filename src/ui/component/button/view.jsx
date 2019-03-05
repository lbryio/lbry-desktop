// @flow
import * as React from 'react';
import Icon from 'component/common/icon';
import classnames from 'classnames';

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
  // TODO: these (nav) should be a reusable type
  doNavigate: (string, ?any) => void,
  navigateParams: any,
  className: ?string,
  description: ?string,
  type: string,
  button: ?string, // primary, secondary, alt, link
  noPadding: ?boolean, // to remove padding and allow circular buttons
  iconColor?: string,
  iconSize?: number,
  constrict: ?boolean, // to shorten the button and ellipsis, only use for links
  selected: ?boolean,
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
      iconRight,
      disabled,
      children,
      navigate,
      navigateParams,
      doNavigate,
      className,
      description,
      button,
      type,
      noPadding,
      iconColor,
      iconSize,
      constrict,
      selected,
      ...otherProps
    } = this.props;

    const combinedClassName = classnames(
      'button',
      {
        'button--no-padding': noPadding,
      },
      button
        ? {
            'button--primary': button === 'primary',
            'button--secondary': button === 'secondary',
            'button--alt': button === 'alt',
            'button--danger': button === 'danger',
            'button--inverse': button === 'inverse',
            'button--disabled': disabled,
            'button--link': button === 'link',
            'button--constrict': constrict,
            'button--selected': selected,
          }
        : 'button--no-style',
      className
    );

    const extendedOnClick =
      !onClick && navigate
        ? event => {
            event.stopPropagation();
            doNavigate(navigate, navigateParams || {});
          }
        : onClick;

    const content = (
      <span className="button__content">
        {icon && <Icon icon={icon} iconColor={iconColor} size={iconSize} />}
        {label && <span className="button__label">{label}</span>}
        {children && children}
        {iconRight && <Icon icon={iconRight} iconColor={iconColor} size={iconSize} />}
      </span>
    );

    return href ? (
      <a className={combinedClassName} href={href} title={title}>
        {content}
      </a>
    ) : (
      <button
        title={title}
        aria-label={description || label || title}
        className={combinedClassName}
        onClick={extendedOnClick}
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
