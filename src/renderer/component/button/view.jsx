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
  uppercase: ?boolean,
  iconColor: ?string,
  tourniquet: ?boolean, // to shorten the button and ellipsis, only use for links
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
      uppercase,
      iconColor,
      tourniquet,
      ...otherProps
    } = this.props;

    const combinedClassName = classnames(
      'btn',
      {
        'btn--no-padding': noPadding,
      },
      button
        ? {
            'btn--primary': button === 'primary',
            'btn--secondary': button === 'secondary',
            'btn--alt': button === 'alt',
            'btn--danger': button === 'danger',
            'btn--inverse': button === 'inverse',
            'btn--disabled': disabled,
            'btn--link': button === 'link',
            'btn--external-link': button === 'link' && href,
            'btn--uppercase': uppercase,
            'btn--tourniquet': tourniquet,
          }
        : 'btn--no-style',
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
      <span className="btn__content">
        {icon && <Icon icon={icon} iconColor={iconColor} />}
        {label && <span className="btn__label">{label}</span>}
        {children && children}
        {iconRight && <Icon icon={iconRight} iconColor={iconColor} />}
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
