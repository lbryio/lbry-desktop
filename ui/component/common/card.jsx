// @flow
import type { Node } from 'react';
import React, { useState } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Button from 'component/button';
import { toCapitalCase } from 'util/string';
import * as ICONS from 'constants/icons';

type Props = {
  title?: string | Node,
  subtitle?: string | Node,
  body?: string | Node,
  actions?: string | Node,
  icon?: string,
  className?: string,
  isPageTitle?: boolean,
  isBodyTable?: boolean,
  defaultExpand?: boolean,
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
    defaultExpand,
  } = props;
  const [expanded, setExpanded] = useState(defaultExpand);
  const expandable = defaultExpand !== undefined;

  return (
    <section className={classnames(className, 'card')}>
      {(title || subtitle) && (
        <div className="card__header--between">
          <div className="card__section--flex">
            {icon && <Icon sectionIcon icon={icon} />}
            <div>
              {isPageTitle && <h1 className="card__title">{title}</h1>}
              {!isPageTitle && <h2 className="card__title">{title}</h2>}
              {subtitle && <div className="card__subtitle">{subtitle}</div>}
            </div>
          </div>
          {expandable && (
            <div className="card__expand-btn">
              <Button
                button={'alt'}
                aria-label={__('More')}
                icon={expanded ? toCapitalCase(ICONS.SUBTRACT) : toCapitalCase(ICONS.ADD)}
                onClick={() => setExpanded(!expanded)}
              />
            </div>
          )}
        </div>
      )}
      {(!expandable || (expandable && expanded)) && (
        <>
          {body && (
            <div
              className={classnames('card__body', {
                'card__body--no-title': !title && !subtitle,
                'card__body--table': isBodyTable,
              })}
            >
              {body}
            </div>
          )}
          {actions && <div className="card__main-actions">{actions}</div>}
        </>
      )}
    </section>
  );
}
