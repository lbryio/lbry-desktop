var PublishPage = React.createClass({
  publish: function() {
    lbry.publish({
      name: this.refs.name,
      file_path: this.refs.filePath,
      bid: parseFloat(this.refs.bid),
    });
  },
  render: function() {
    return (
      <main className="page">
        <SubPageLogo />
        <h1>Publish</h1>
        <section>
          <h4>LBRY name</h4>
          <div className="help">What LBRY name would you like to claim for this file?</div>
          lbry://<input type="text" ref="name" />
        </section>

        <section>
          <h4>Choose file</h4>
          <div className="help">Please choose the file you would like to upload to LBRY.</div>
          <div><input type="file" ref="filePath" /></div>
        </section>

        <section>
          <h4>Bid amount</h4>
          <div className="help">How much would you like to bid for this name? You must bid at least <strong>0.0</strong> to claim this name.</div>
          <input type="text" ref="bidAmount" /> LBC
        </section>

        { /* Many more options here ... */ }

        <section>
        <Link button="primary" label="Publish" onClick={this.publish} />
        </section>
        <section>
          <Link href="/" label="<< Return"/>
        </section>
       </main>
    );
  }
});