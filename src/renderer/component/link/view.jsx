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
  inverse: ?boolean,
  circle: ?boolean,
  alt: ?boolean,
  flat: ?boolean,
  fakeLink: ?boolean,
  description: ?string,
};

const Button = (props: Props) => {
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
    inverse,
    alt,
    circle,
    flat,
    fakeLink,
    description,
    ...otherProps
  } = props;

  const combinedClassName = classnames(
    {
      btn: !fakeLink,
      'btn--link': fakeLink,
      'btn--primary': !fakeLink && !alt,
      'btn--alt': alt,
      'btn--inverse': inverse,
      'btn--disabled': disabled,
      'btn--circle': circle,
      'btn--flat': flat,
    },
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
    <React.Fragment>
      {icon && <Icon icon={icon} fixed />}
      {label && <span className="btn__label">{label}</span>}
      {children && children}
      {iconRight && <Icon icon={iconRight} fixed />}
    </React.Fragment>
  );

  return href ? (
    <a className={combinedClassName} href={href} title={title}>
      {content}
    </a>
  ) : (
    <button
      aria-label={description || title}
      className={combinedClassName}
      onClick={extendedOnClick}
      disabled={disabled}
      {...otherProps}
    >
      {content}
    </button>
  );
};

export default Button;
