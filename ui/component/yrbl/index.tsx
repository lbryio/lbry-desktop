import type {ReactNode} from 'react';
import * as React from 'react';
import classnames from 'classnames';
// @ts-expect-error - TS2792 - Cannot find module 'static/img/yrblhappy.svg'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import YrblHappy from 'static/img/yrblhappy.svg';
// @ts-expect-error - TS2792 - Cannot find module 'static/img/yrblsad.svg'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import YrblSad from 'static/img/yrblsad.svg';

type Props = {
  title?: string,
  subtitle?: string | React.ReactNode,
  type: string,
  className?: string,
  actions?: React.ReactNode,
  alwaysShow?: boolean
};

const yrblTypes = {
  happy: YrblHappy,
  sad: YrblSad,
} as const;

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
