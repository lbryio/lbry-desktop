import React from 'react';
import PublishForm from 'component/publishForm';
import Page from 'component/page';

class PublishPage extends React.PureComponent {
  scrollToTop = () => {
    // #content wraps every <Page>
    const mainContent = document.getElementById('content');
    if (mainContent) {
      mainContent.scrollTop = 0; // It would be nice to animate this
    }
  };

  render() {
    return (
      <Page>
        <PublishForm {...this.props} scrollToTop={this.scrollToTop} />
      </Page>
    );
  }
}

export default PublishPage;
