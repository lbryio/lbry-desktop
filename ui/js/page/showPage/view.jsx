import React from 'react';
import {
  BusyMessage,
} from 'component/common';
import FilePage from 'page/filePage'

class ShowPage extends React.Component{
  componentWillMount() {
    this.resolve(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps)
  }

  resolve(props) {
    const {
      isResolvingUri,
      resolveUri,
      claim,
      uri,
    } = props

    if(!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri)
    }
  }

  render() {
    const {
      channelClaim,
      claim,
      uri,
      isResolvingUri,
    } = this.props

    let innerContent = "";

    if (isResolvingUri || claim === null) {
      innerContent = <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{uri}</h1></div>
        </div>
        <div className="card__content">
          { isResolvingUri && <BusyMessage message="Loading magic decentralized data..." /> }
          { claim === null && <span className="empty">There's nothing at this location.</span> }
        </div>
      </section>
    }
    else if (channelClaim && claim && channelClaim.txid && channelClaim.txid === claim.txid) {
      innerContent = <ChannelPage claim={claim} />
    }
    else if (claim) {
      innerContent = <FilePage />
    }

    return (
      <main className="main--single-column">{innerContent}</main>
    )
  }
}

export default ShowPage
