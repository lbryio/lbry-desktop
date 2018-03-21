import React from 'react';
import PropTypes from 'prop-types';

export default function WrapSaveUserHistory(WrappedComponent, uri) {

  return class extends React.Component {

    static propTypes = {
      saveUserHistory: PropTypes.func.isRequired
    }

    componentDidMount() {
      this.props.saveUserHistory(uri);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
