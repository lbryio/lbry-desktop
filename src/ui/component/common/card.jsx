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
};

export default function Card(props: Props) {
  const { title, subtitle, body, actions, icon } = props;
  return (
    <section className={classnames('card')}>
      {title && (
        <div className="card__header">
          <div className="section__flex">
            {icon && <Icon sectionIcon icon={icon} />}
            <div>
              <h2 className="section__title">{title}</h2>
              <div className="section__subtitle">{subtitle}</div>
            </div>
          </div>
        </div>
      )}

      {body && <div className={classnames('card__body', { 'card__body--with-icon': icon })}>{body}</div>}
      {actions && (
        <div className={classnames('card__main-actions', { 'card__main-actions--with-icon': icon })}>{actions}</div>
      )}
    </section>
  );
}
