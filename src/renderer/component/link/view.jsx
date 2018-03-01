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
  noStyle: ?boolean,
  noUnderline: ?boolean,
  description: ?string,
  secondary: ?boolean,
  type: string
};

class Button extends React.PureComponent<Props> {
  static defaultProps = {
    type: "button"
  }

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
      inverse,
      alt,
      circle,
      flat,
      fakeLink,
      description,
      noStyle,
      noUnderline,
      secondary,
      type,
      ...otherProps
    } = this.props;

    const combinedClassName = classnames(
      'btn',
      noStyle
        ? 'btn--no-style'
        : {
            'btn--link': fakeLink,
            'btn--primary': !alt && !fakeLink && !secondary, // default to primary
            'btn--secondary': secondary,
            'btn--alt': alt,
            'btn--inverse': inverse,
            'btn--disabled': disabled,
            'btn--circle': circle,
            'btn--flat': flat,
            'btn--no-underline': fakeLink && noUnderline,
            'btn--external-link': href
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
        {icon && <Icon icon={icon} />}
        {label && <span className="btn__label">{label}</span>}
        {children && children}
        {iconRight && <Icon icon={iconRight} />}
      </React.Fragment>
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
