// @flow
import type { Node } from 'react';
import * as React from 'react';
import classnames from 'classnames';
// $FlowFixMe cannot resolve ...
import YrblHappy from 'static/img/yrblhappy.svg';
// $FlowFixMe cannot resolve ...
import YrblSad from 'static/img/yrblsad.svg';

type Props = {
  title?: string,
  subtitle?: string | React.Node,
  type: string,
  className?: string,
  actions?: Node,
  alwaysShow?: boolean,
};

const yrblTypes = {
  happy: YrblHappy,
  sad: YrblSad,
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'happy',
  };

  render() {
    const { title, subtitle, type, className, actions, alwaysShow = false } = this.props;

    const image = yrblTypes[type];

    return (
      <div className="yrbl__wrap">
        <img
          alt="Friendly gerbil"
          className={classnames('yrbl', className, {
            'yrbl--always-show': alwaysShow,
          })}
          src={`${image}`}
        />
        <div>
          {(title || subtitle) && (
            <div className="yrbl__content">
              <h2 className="section__title">{title}</h2>
              <p className="section__subtitle">{subtitle}</p>
            </div>
          )}
          {actions}
        </div>
      </div>
    );
  }
}
