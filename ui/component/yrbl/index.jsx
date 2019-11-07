// @flow
import * as React from 'react';
import classnames from 'classnames';
import HappyYrbl from './gerbil-happy.png';
import SadYrbl from './gerbil-sad.png';

type Props = {
  title?: string,
  subtitle?: string | React.Node,
  type: string,
  className?: string,
};

const yrblTypes = {
  happy: HappyYrbl,
  sad: SadYrbl,
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'happy',
  };

  render() {
    const { title, subtitle, type, className } = this.props;

    const image = yrblTypes[type];

    return (
      <div className="yrbl__wrap">
        <img alt="Friendly gerbil" className={classnames('yrbl', className)} src={`${image}`} />
        {title && subtitle && (
          <div className="yrbl__content">
            <h2 className="card__title">{title}</h2>
            <p>{subtitle}</p>
          </div>
        )}
      </div>
    );
  }
}
