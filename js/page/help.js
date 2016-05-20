//@TODO: Customize advice based on OS

var HelpPage = React.createClass({
  render: function() {
    return (
      <main>
        <h1>Troubleshooting</h1>
        <p>Here are the most commonly encountered problems and what to try doing about them.</p>

        <h3>Nothing seems to start downloading.</h3>
        <p>If you can't download anything, including 'wonderfullife', try forwarding ports 4444 and 3333 on your firewall or router. If you can access 'wonderfullife' but not other content, it's possible the content is not longer hosted on the network.</p>

        <h3>Videos have trouble playing.</h3>
        <p>Sometimes your video player will start the file while it's still empty. Try reloading the page after a few seconds and it may work. You should also see the file appear in your downloads folder (configured in <a href="/?settings">settings</a>).</p>

        <p>A real fix for this is underway!</p>

        <h3>How do I turn LBRY off?</h3>
        <p>If you're on OS X you can find the app running in the notification area at the top right of your screen. Click the LBRY icon and choose <code>Quit</code>.</p>

        <p>On Linux, you'll find a close button in the menu at the top right of LBRY.</p>

        <p>If you're running LBRY from the command line, you may also close the app with the command <code>stop-lbrynet-daemon</code></p>

        <h3>None of this applies to me, or it didn't work.</h3>
        <p>Please <Link href="/?report" label="send us a bug report" />. Thanks!</p>
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>
    );
  }
});
