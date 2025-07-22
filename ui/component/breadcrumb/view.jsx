import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

function Breadcrumb(props) {
  const { items = [], separator = '/', className, showHome = true } = props;

  const breadcrumbItems = showHome ? [{ label: 'Home', path: '/', icon: ICONS.HOME }, ...items] : items;

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className={classnames('breadcrumb', className)} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="breadcrumb__item">
              {!isFirst && <span className="breadcrumb__separator">{separator}</span>}

              {isLast ? (
                <span className="breadcrumb__current">
                  {item.icon && <Icon icon={item.icon} className="breadcrumb__icon" />}
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="breadcrumb__link">
                  {item.icon && <Icon icon={item.icon} className="breadcrumb__icon" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
