// @flow
import * as React from 'react';
import styles from './yrbl.module.scss';
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
    const { title, subtitle, type, enhanced } = this.props;

    const image = yrblTypes[type];

    return (
      <div className={styles.container}>
        <img alt="Friendly gerbil" className={enhanced ? style.yrblEnhanced : styles.yrbl} src={image} />
        {title && subtitle && (
          <div className={styles.content}>
            <h2 className="card__title">{title}</h2>
            <div className="card__content">{subtitle}</div>
          </div>
        )}
      </div>
    );
  }
}
