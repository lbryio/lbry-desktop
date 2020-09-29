// @flow
import * as React from 'react';
import classnames from 'classnames';
import { YRBL_HAPPY_IMG_URL, YRBL_SAD_IMG_URL } from 'config';

type Props = {
  title?: string,
  subtitle?: string | React.Node,
  type: string,
  className?: string,
};

const yrblTypes = {
  happy: YRBL_HAPPY_IMG_URL,
  sad: YRBL_SAD_IMG_URL,
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
            <h2 className="section__title">{title}</h2>
            <p className="section__subtitle">{subtitle}</p>
          </div>
        )}
      </div>
    );
  }
}
