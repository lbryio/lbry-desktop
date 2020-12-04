// @flow
import React from 'react';

type Props = {
  text: ?string,
};

class Empty extends React.PureComponent<Props> {
  static defaultProps = {
    text: '',
  };

  render() {
    const { text } = this.props;

    return (
      <div className="empty__wrap">
        <div>
          {text && (
            <div className="empty__content">
              <p className="empty__text">{text}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Empty;
