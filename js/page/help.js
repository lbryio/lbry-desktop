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
            Live help is available most hours in the #help channel of our Slack chat room.
          </p>
          <p>
            <Link button="alt" label="Join Our Slack" icon="icon-slack" href="https://slack.lbry.io" />
          </p>
        </section>
        <section className="card">
          <h3>Common Issues</h3>
          <h4>Nothing seems to start downloading.</h4>
          <p>If you can't download anything, including 'wonderfullife', try forwarding ports 4444 and 3333 on your firewall or router. If you can access 'wonderfullife' but not other content, it's possible the content is not longer hosted on the network.</p>

          <h4>Videos have trouble playing.</h4>
          <p>Sometimes your video player will start the file while it's still empty. Try reloading the page after a few seconds and it may work. You should also see the file appear in your downloads folder (configured in <a href="/?settings">settings</a>).</p>

          <p>A real fix for this is underway!</p>

          <h4>How do I turn LBRY off?</h4>
          <p>If you're on OS X you can find the app running in the notification area at the top right of your screen. Click the LBRY icon and choose <code>Quit</code>.</p>

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
