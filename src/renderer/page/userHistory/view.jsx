import React from 'react';
import PropTypes from 'prop-types';
import { normalizeURI } from 'lbryURI';
import FileTile from 'component/fileTile';
import SubHeader from 'component/subHeader';
import moment from 'moment';

class UserHistoryPage extends React.PureComponent {
  
  static propTypes = {
    history: PropTypes.objectOf(PropTypes.number)
  }

  render() {
    const { history, clear } = this.props;

    return (
      <div>
        <main className="main--no-margin">
          <SubHeader fullWidth smallMargin />
          <section className="section-spaced">
            <div style={{width: "800px"}}>
              {Object.keys(history).length > 0 ?
                Object.keys(history).map(uri => (
                  <div key={uri}>
                    <span style={{float: "right"}}>
                      <a className="link" onClick={() => clear(uri)}>remove</a>
                    </span>
                    <p>Last visited {moment(history[uri]).from(moment())}.</p>
                    <FileTile uri={normalizeURI(uri)} />
                  </div>
                )
              ) : (
                <p>You have no saved history. Go find some content!</p>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }
}
export default UserHistoryPage;
