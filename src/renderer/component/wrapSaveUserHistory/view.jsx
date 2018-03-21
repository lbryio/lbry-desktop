import React from 'react';

export default function WrapSaveUserHistory(WrappedComponent, uri) {

  return class extends React.Component {

    componentDidMount() {
      this.props.saveUserHistory(uri);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
