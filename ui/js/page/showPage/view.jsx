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

    if(!isResolvingUri && !claim && uri) {
      resolveUri(uri)
    }
  }

  render() {
    const {
      claim,
      uri,
      isResolvingUri,
    } = this.props

    let innerContent = "";

    if (isResolvingUri) {
      innerContent = <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{uri}</h1></div>
        </div>
        <div className="card__content">
          <BusyMessage message="Loading magic decentralized data..." /> :
        </div>
      </section>;
    }
    else if (claim && claim.whatever) {
      innerContent = "channel"
      // innerContent = <ChannelPage title={uri} />
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
