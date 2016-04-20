var StartPage = React.createClass({
  componentWillMount: function() {
    lbry.stop();
  },
  render: function() {
    return (
      <main>
        <h1>LBRY is not running</h1>
        <Link href="lbry://lbry" label="Start LBRY" />
      </main>
    );
  }
});