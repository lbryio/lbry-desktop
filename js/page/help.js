//@TODO: Customize advice based on OS

var HelpPage = React.createClass({
  getInitialState: function() {
    return {
      versionInfo: null,
    };
  },
  componentWillMount: function() {
    lbry.getVersionInfo((info) => {
      this.setState({
        versionInfo: info,
      });
    });
  },
  componentDidMount: function() {
    document.title = "Help";
  },
  render: function() {
    var ver = this.state.versionInfo;

    if (ver) {
      if (ver.os_system == 'Darwin') {
        var osName = (parseInt(ver.os_release.match(/^\d+/)) < 16 ? 'Mac OS X' : 'Mac OS');

        var platform = osName + ' ' + ver.os_release;
        var newVerLink = 'https://lbry.io/get/lbry.dmg';
      } else if (ver.os_system == 'Linux') {
        var platform = 'Linux (' + ver.platform + ')';
        var newVerLink = 'https://lbry.io/get/lbry.deb';
      } else {
        var platform = 'Windows (' + ver.platform + ')';
        var newVerLink = 'https://lbry.io/get/lbry.msi';
      }
    }

    return (
      <main className="page">
        <section className="card">
          <h3>Read the FAQ</h3>
          <p>Our FAQ answers many common questions.</p>
          <p><Link href="https://lbry.io/faq" label="Read the FAQ" icon="icon-question" button="alt"/></p>
        </section>
        <section className="card">
          <h3>Get Live Help</h3>
          <p>
            Live help is available most hours in the <strong>#help</strong> channel of our Slack chat room.
          </p>
          <p>
            <Link button="alt" label="Join Our Slack" icon="icon-slack" href="https://slack.lbry.io" />
          </p>
        </section>
        <section className="card">
          <h3>Report a Bug</h3>
          <p>Did you find something wrong?</p>
          <p><Link href="/?report" label="Submit a Bug Report" icon="icon-bug" button="alt" /></p>
          <div className="meta">Thanks! LBRY is made by it's users.</div>
        </section>
        {!ver ? null :
          <section className="card">
            <h3>About</h3>
            {ver.lbrynet_update_available || ver.lbryum_update_available ?
              <p>A newer version of LBRY is available. <Link href={newVerLink} label={"Download LBRY " + ver.remote_lbrynet + " now!"} /></p>
              : <p>Your copy of LBRY is up to date.</p>
            }
            <table className="table-standard">
              <tr>
                <th>lbrynet (data)</th>
                <td>{ver.lbrynet_version}</td>
              </tr>
              <tr>
                <th>lbryum (wallet)</th>
                <td>{ver.lbryum_version}</td>
              </tr>
              <tr>
                <th>Platform</th>
                <td>{platform}</td>
              </tr>
            </table>
          </section>
        }
      </main>
    );
  }
});
