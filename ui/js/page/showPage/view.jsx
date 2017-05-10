import React from 'react';
import {
  BusyMessage,
} from 'component/common';
import FilePage from 'page/filePage'

class ShowPage extends React.Component{
  componentWillMount() {
    const {
      isResolvingUri,
      resolveUri,
      claim,
      uri,
    } = this.props

    if(!isResolvingUri && !claim && uri) {
      resolveUri(uri)
    }
  }

  render() {
    const {
      claim: {
        value: {
          stream: {
            metadata
          } = {},
        } = {},
      } = {},
      navigate,
      uri,
      isResolvingUri,
      claimType,
    } = this.props

    const pageTitle = metadata ? metadata.title : uri;

    let innerContent = "";

    if (isResolvingUri) {
      innerContent = <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>{pageTitle}</h1></div>
        </div>
        <div className="card__content">
          { isResolvingUri ?
            <BusyMessage message="Loading magic decentralized data..." /> :
            <p>This location is not yet in use. { ' ' }<Link onClick={() => navigate('/publish')} label="Put something here" />.</p>
          }
        </div>
      </section>;
    }
    else if (claimType == "channel") {
      innerContent = <ChannelPage title={uri} />
    }
    else {
      innerContent = <FilePage uri={uri} />
    }

    return (
      <main className="main--single-column">{innerContent}</main>
    )
  }
}

export default ShowPage
