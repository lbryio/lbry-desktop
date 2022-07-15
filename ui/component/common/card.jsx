// @flow
import type { Node } from 'react';
import React, { useState } from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  title?: string | Node,
  subtitle?: string | Node,
  titleActions?: string | Node,
  id?: string,
  body?: string | Node,
  actions?: string | Node,
  icon?: string,
  className?: string,
  isPageTitle?: boolean,
  noTitleWrap?: boolean,
  isBodyList?: boolean,
  defaultExpand?: boolean,
  nag?: Node,
  smallTitle?: boolean,
  onClick?: () => void,
  children?: Node,
  secondPane?: Node,
  slimHeader?: boolean,
  colorHeader?: boolean,
  singlePane?: boolean,
  headerActions?: Node,
  gridHeader?: boolean,
};

function Card(props: Props) {
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
    slimHeader,
    colorHeader,
    singlePane,
    headerActions,
    gridHeader,
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
      <FirstPaneWrapper singlePane={singlePane}>
        {(title || subtitle) && (
          <div
            className={classnames('card__header--between', {
              'card__header--nowrap': noTitleWrap,
              'card__header--slim': slimHeader,
              'card__header--bg-color': colorHeader,
              'card__header--grid': gridHeader,
            })}
          >
            <div className={classnames('card__title-section', { 'card__title-section--body-list': isBodyList })}>
              {icon && <Icon sectionIcon icon={icon} />}

              <div className="card__title-text">
                <TitleWrapper isPageTitle={isPageTitle} smallTitle={smallTitle}>
                  {title}
                </TitleWrapper>

                {subtitle && (
                  <div className={classnames('card__subtitle', { 'card__subtitle--small': smallTitle })}>
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {(titleActions || expandable) && (
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
                      button="alt"
                      aria-expanded={expanded}
                      aria-label={expanded ? __('Less') : __('More')}
                      icon={expanded ? ICONS.SUBTRACT : ICONS.ADD}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </div>
                )}
              </div>
            )}

            {headerActions}
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
      </FirstPaneWrapper>

      {secondPane && <div className="card__second-pane">{secondPane}</div>}
    </section>
  );
}

type FirstPaneProps = {
  singlePane?: boolean,
  children: any,
};

const FirstPaneWrapper = (props: FirstPaneProps) => {
  const { singlePane, children } = props;

  return singlePane ? children : <div className="card__first-pane">{children}</div>;
};

type TitleProps = {
  isPageTitle?: boolean,
  smallTitle?: boolean,
  children?: any,
};

const TitleWrapper = (props: TitleProps) => {
  const { isPageTitle, smallTitle, children } = props;

  return isPageTitle ? (
    <h1 className="card__title">{children}</h1>
  ) : (
    <h2 className={classnames('card__title', { 'card__title--small': smallTitle })}>{children}</h2>
  );
};

export default Card;
