import React from 'react';

class ChannelPage extends React.Component{
  componentDidMount() {
    this.fetchClaims(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchClaims(nextProps)
  }

  fetchClaims(props) {
    if (props.claims === undefined) {
      props.fetchClaims(props.uri)
    }
  }

  render() {
    const {
      claims,
      claim,
      uri
    } = this.props

    console.log(claims);
    return <main className="main--single-column">
      <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{uri}</h1></div>
        </div>
        <div className="card__content">
          <p>
            This channel page is a stub.
          </p>
        </div>
      </section>
      <section className="card">
        <div className="card__content">
          {claims}
        </div>
      </section>
    </main>
  }
}

export default ChannelPage;
