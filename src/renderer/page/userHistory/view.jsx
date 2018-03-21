import React from 'react';
import PropTypes from 'prop-types';
import { normalizeURI } from 'lbryURI';
import FileTile from 'component/fileTile';
import SubHeader from 'component/subHeader';

class UserHistoryPage extends React.PureComponent {
  
  static propTypes = {
    saveUserHistory: PropTypes.func.isRequired
  }

  render() {
    const { history } = this.props;

    return (
      <div>
        <main className="main--no-margin">
          <SubHeader fullWidth smallMargin />
          <section className="section-spaced">
            <div style={{width: "800px"}}>
              {Object.keys(history).length > 0 ?
                Object.keys(history).map(uri => (
                  <FileTile key={uri} uri={normalizeURI(uri)} />
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
