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
        {icon && <Icon icon={icon} />}
        {label && <span className="btn__label">{label}</span>}
        {children && children}
        {iconRight && <Icon icon={iconRight} />}
      </span>
    );

    return href ? (
      <a className={combinedClassName} href={href} title={title}>
        {content}
      </a>
    ) : (
      <button
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
