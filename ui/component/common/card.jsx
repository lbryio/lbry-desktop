// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';

type Props = {
  title?: string | Node,
  subtitle?: string | Node,
  body?: string | Node,
  actions?: string | Node,
  icon?: string,
  className?: string,
  isPageTitle?: boolean,
  isBodyTable?: boolean,
  actionIconPadding?: boolean,
};

export default function Card(props: Props) {
  const {
    title,
    subtitle,
    body,
    actions,
    icon,
    className,
    isPageTitle = false,
    isBodyTable = false,
    actionIconPadding = true,
  } = props;
  return (
    <section className={classnames(className, 'card')}>
      {(title || subtitle) && (
        <div className="card__header">
          {icon && <Icon sectionIcon icon={icon} />}
          <div>
            {isPageTitle && <h1 className="card__title">{title}</h1>}
            {!isPageTitle && <h2 className="card__title">{title}</h2>}
            {subtitle && <div className="card__subtitle">{subtitle}</div>}
          </div>
        </div>
      )}

      {body && (
        <div
          className={classnames('card__body', {
            'card__body--with-icon': icon,
            'card__body--no-title': !title && !subtitle,
            'card__body--table': isBodyTable,
          })}
        >
          {body}
        </div>
      )}
      {actions && (
        <div
          className={classnames('card__main-actions', { 'card__main-actions--with-icon': icon && actionIconPadding })}
        >
          {actions}
        </div>
      )}
    </section>
  );
}
