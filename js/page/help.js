var HelpPage = React.createClass({
  render: function() {
    return (
      <main>
        <h1>Troubleshooting</h1>
        <p>Here are the most commonly encountered problems and what to try doing about them</p>
        <br></br>
          <h3>Nothing seems to start downloading</h3>
          <p>Not all content that you find in the search window is necessarily hosted,
              LBRY is still young. However, 'wonderfullife' should assuredly be
              accessible. If you can't download it, and you're not experiencing the below problem,
              try forwarding ports 4444 and 3333 on your firewall or router.
          </p>
          <br></br>
          <h3>Videos have trouble playing</h3>
          <p>This is caused by your video player trying to start the file
            while it's still empty. Try reloading the page after a few seconds,
            it should work. You should also see the file appear in the downloads folder configured in your LBRY settings,
              which is the gear icon at the top of the main menu.
              A real fix for this is underway!
          </p>
          <br></br>
          <h3>How do I turn LBRY off?</h3>
          <p>
              If you're on OS X you can find the app running in your status bar, if you click the LBRY icon you'll have a 'Quit' button available.
              There is also a 'X' button in the browser main menu, either way works,
              the 'X' button is the default way to close LBRY on Linux.
              If you're running LBRY from the command line, you can use the above or you can run 'stop-lbrynet-daemon'
          </p>
          <br></br>
          <h3>None of this applies to me, or it didn't work</h3>
          <p>
              Please <Link href="/?report" label="send us a bug report"/>. Thanks!
              <br></br>
          </p>
          <br></br>
          <br></br>
        <section>
          <Link href="/" label="<< Return"/>
        </section>
      </main>
    );
  }
});