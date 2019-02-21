// @flow
import * as React from 'react';
import Native from 'native';
import classnames from 'classnames';

type Props = {
  title: string,
  subtitle: string | React.Node,
  type: string,
  className?: string,
};

const yrblTypes = {
  happy: 'gerbil-happy.png',
  sad: 'gerbil-sad.png',
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'happy',
  };

  render() {
    const { title, subtitle, type, className } = this.props;

    const image = yrblTypes[type];

    return (
      <div className={classnames('yrbl-wrap', className)}>
        <img alt="Friendly gerbil" className="yrbl" src={Native.imagePath(image)} />
        <div className="card__content">
          <h2 className="card__title">{title}</h2>
          <div className="card__subtitle">{subtitle}</div>
        </div>
      </div>
    );
  }
}
