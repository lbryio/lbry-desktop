var StartPage = React.createClass({
  componentWillMount: function() {
    lbry.stop();
  },
  render: function() {
    return (
      <main className="page">
        <h1>LBRY has closed</h1>
        <Link href="lbry://lbry" label="Click here to start LBRY" />
      </main>
    );
  }
});