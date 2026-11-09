import type {ReactNode} from 'react';
import React, { useState } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  title?: string | React.ReactNode,
  subtitle?: string | React.ReactNode,
  titleActions?: string | React.ReactNode,
  id?: string,
  body?: string | React.ReactNode,
  actions?: string | React.ReactNode,
  icon?: string,
  className?: string,
  isPageTitle?: boolean,
  noTitleWrap?: boolean,
  isBodyList?: boolean,
  defaultExpand?: boolean,
  nag?: React.ReactNode,
  smallTitle?: boolean,
  onClick?: () => void,
  children?: React.ReactNode,
  secondPane?: React.ReactNode
};

export default function Card(props: Props) {
  const {
    title,
    subtitle,
    titleActions,
    id,
    body,
    actions,
    icon,
    className,
    isPageTitle = false,
    isBodyList = false,
    noTitleWrap = false,
    smallTitle = false,
    defaultExpand,
    nag,
    onClick,
    children,
    secondPane,
  } = props;
  const [expanded, setExpanded] = useState(defaultExpand);
  const expandable = defaultExpand !== undefined;

  return (
    <section
      role={onClick ? 'button' : undefined}
      className={classnames(className, 'card', {
        'card__multi-pane': Boolean(secondPane),
      })}
      id={id}
      onClick={(e) => {
        if (onClick) {
          onClick();
          e.stopPropagation();
        }
      }}
    >
      <div className="card__first-pane">
        {(title || subtitle) && (
          <div
            className={classnames('card__header--between', {
              'card__header--nowrap': noTitleWrap,
            })}
          >
            <div
              className={classnames('card__title-section', {
                'card__title-section--body-list': isBodyList,
                'card__title-section--smallx': smallTitle,
              })}
            >
              {icon && <Icon sectionIcon icon={icon} />}
              <div>
                {isPageTitle && <h1 className="card__title">{title}</h1>}
                {!isPageTitle && (
                  <h2 className={classnames('card__title', { 'card__title--small': smallTitle })}>{title}</h2>
                )}
                {subtitle && <div className="card__subtitle">{subtitle}</div>}
              </div>
            </div>
            <div className="card__title-actions-container">
              {titleActions && (
                <div
                  className={classnames('card__title-actions', {
                    'card__title-actions--small': smallTitle,
                  })}
                >
                  {titleActions}
                </div>
              )}
              {expandable && (
                <div className="card__title-actions">
                  <Button
                    // @ts-expect-error - TS2322 (ts-migration)
                    button="alt"
                    aria-expanded={expanded}
                    aria-label={expanded ? __('Less') : __('More')}
                    icon={expanded ? ICONS.SUBTRACT : ICONS.ADD}
                    onClick={() => setExpanded(!expanded)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {(!expandable || (expandable && expanded)) && (
          <>
            {body && (
              <div
                className={classnames('card__body', {
                  'card__body--no-title': !title && !subtitle,
                  'card__body--list': isBodyList,
                })}
              >
                {body}
              </div>
            )}
            {actions && <div className="card__main-actions">{actions}</div>}
            {children && <div className="card__main-actions">{children}</div>}
          </>
        )}
        {nag}
      </div>
      {secondPane && <div className="card__second-pane">{secondPane}</div>}
    </section>
  );
}
