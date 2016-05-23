//@TODO: Customize advice based on OS

var HelpPage = React.createClass({
  render: function() {
    return (
      <main className="page">
        <h1>Troubleshooting</h1>
        <p>Here are the most commonly encountered problems and what to try doing about them</p>

        <h3>Nothing seems to start downloading</h3>
        <p>Not all content that you find in the search window is necessarily hosted; LBRY is still young. However, 'wonderfullife' should assuredly be accessible. If you can't download it, and you're not experiencing the below problem, try forwarding ports 4444 and 3333 on your firewall or router.</p>

        <h3>Videos have trouble playing</h3>
        <p>This is caused by your video player trying to start the file  while it's still empty. Try reloading the page after a few seconds, it should work. You should also see the file appear in the downloads folder configured in your LBRY settings, which is the gear icon at the top of the main menu.</p>

        <p>A real fix for this is underway!</p>

        <h3>How do I turn LBRY off?</h3>
        <p>If you're on OS X you can find the app running in the notification area at the top right of your screen; simply click the LBRY icon and choose "Quit."</p>

        <p>On Linux, you'll find a Close button in the menu at the top right of LBRY.</p>

        <p>If you're running LBRY from the command line, you may also close the app with the command "stop-lbrynet-daemon."</p>

        <h3>None of this applies to me, or it didn't work</h3>
        <p>Please <Link href="/?report" label="send us a bug report" />. Thanks!</p>
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>
    );
  }
});