var MyFilesCellStyle = {
  padding: '3px',
  border: '2px solid black',
};

var MyFilesRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td style={MyFilesCellStyle}>{this.props.streamName}</td>
        <td style={MyFilesCellStyle}>{this.props.completed ? 'True' : 'False'}</td>
        <td style={MyFilesCellStyle}><Link label={this.props.stopped ? 'Start' : 'Stop'} /></td>        
        <td style={MyFilesCellStyle}><Link label="Cancel" /></td>        
      </tr>
    );
  }
});

var MyFilesPage = React.createClass({
  getInitialState: function() {
    return {
      filesInfo: null,
    };
  },
  componentWillMount: function() {
    lbry.getFilesInfo((filesInfo) => {
      this.setState({
        filesInfo: filesInfo
      });
    });
  },
  render: function() {
    if (!this.state.filesInfo) {
      return null;
    } else {
      var rows = [];
      for (let fileInfo of this.state.filesInfo) {
        console.log(fileInfo);
        rows.push(<MyFilesRow streamName={fileInfo.stream_name} completed={fileInfo.completed} />);
      }
      console.log(rows);
      return (
        <main>
        <h1>My files</h1>
        <table>
          <thead>
            <tr>
              <th style={MyFilesCellStyle}>Stream name</th>
              <th style={MyFilesCellStyle}>Completed</th>
              <th style={MyFilesCellStyle}>Toggle</th>
              <th style={MyFilesCellStyle}>Remove</th>
            </tr>
          </thead>
        <tbody>
          {rows}
        </tbody>
        </table>

        <section>
          <Link href="/" label="<< Return" />
        </section>
        </main>
      );
    }
  }
});