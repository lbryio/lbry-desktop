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
  actionIconPadding?: boolean,
};

export default function Card(props: Props) {
  const { title, subtitle, body, actions, icon, className, actionIconPadding = true } = props;
  return (
    <section className={classnames(className, 'card')}>
      {(title || subtitle) && (
        <div className="card__header">
          <div className="section__flex">
            {icon && <Icon sectionIcon icon={icon} />}
            <div>
              <h2 className="section__title">{title}</h2>
              {subtitle && <div className="section__subtitle">{subtitle}</div>}
            </div>
          </div>
        </div>
      )}

      {body && <div className={classnames('card__body', { 'card__body--with-icon': icon })}>{body}</div>}
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
