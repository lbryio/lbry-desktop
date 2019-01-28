// @flow
import React from 'react';
import Native from 'native';

type Props = {
  title: string,
  subtitle: string,
  type: string,
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
    const { title, subtitle, type } = this.props;

    const image = yrblTypes[type];

    return (
      <div className="yrbl-wrap">
        <img alt="Friendly gerbil" className="yrbl" src={Native.imagePath(image)} />
        <div className="card__content">
          <h2 className="card__title">{title}</h2>
          <p className="card__subtitle">{subtitle}</p>
        </div>
      </div>
    );
  }
}
