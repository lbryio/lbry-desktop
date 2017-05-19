import React from 'react';
import lbryuri from 'lbryuri'

class ChannelPage extends React.Component{
  componentDidMount() {
    this.fetchClaims(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchClaims(nextProps)
  }

  fetchClaims(props) {
    if (props.claimsInChannel === undefined) {
      props.fetchClaims(props.uri)
    }
  }

  render() {
    const {
      claimsInChannel,
      claim,
      uri
    } = this.props

    console.log(claimsInChannel);
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
          {claimsInChannel ?
            claimsInChannel.map((claim) => <FileTile uri={lbryuri.build({name: claim.name, claimId: claim.claim_id})} /> )
            : ''}
        </div>
      </section>
    </main>
  }
}

export default ChannelPage;
