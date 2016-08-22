//@TODO: Customize advice based on OS

var HelpPage = React.createClass({
  componentDidMount: function() {
    document.title = "Help";
  },
  render: function() {
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
          <h3>Common Issues</h3>
          <h4>Nothing seems to start downloading.</h4>
          <p>If you can't download anything, including the Featured Content on the front page, your system may be unable to receive connections from other LBRY users hosting content. If you're able, try forwarding ports 4444 and 3333 on your firewall or router.</p>

          <p>If only certain content is failing to download, the user(s) hosting the file may have disconnected from LBRY, or are having issues with their own connection. We are currently rolling out improvements to the network that will make content more consistently available.</p>

          <h4>Videos have trouble playing.</h4>
          <p>Sometimes the video player will start before enough of the file has downloaded to start playing. Try reloading the page after a few seconds. You should also see the file appear in your downloads folder (configured on the <Link href="/?settings" label="Settings page" />).</p>

          <p>A real fix for this is underway!</p>

          <h4>How do I turn LBRY off?</h4>
          <p>If you're on OS X, you can find the app running in the notification area at the top right of your screen. Click the LBRY icon and choose <code>Quit</code>.</p>

          <p>On Linux, you'll find a close button in the menu at the top right of LBRY.</p>

          <p>If you're running LBRY from the command line, you may also close the app with the command <code>stop-lbrynet-daemon</code></p>
        </section>
        <section className="card">
          <h3>None of this applies to me, or it didn't work.</h3>
          <p>Please <Link href="/?report" label="send us a bug report" />. Thanks!</p>
        </section>
      </main>
    );
  }
});
