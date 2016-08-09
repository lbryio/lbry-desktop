var requiredFieldWarningStyle = {
  color: '#cc0000',
  transition: 'opacity 400ms ease-in',
};

var FormField = React.createClass({
  _type: null,
  _element: null,

  propTypes: {
    type: React.PropTypes.string.isRequired,
    hidden: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {
      warningState: 'hidden',
    }
  },
  componentWillMount: function() {
    if (['text', 'radio', 'checkbox', 'file'].indexOf(this.props.type) != -1) {
      this._element = 'input';
      this._type = this.props.type;
    } else {
      // Non <input> field, e.g. <select>, <textarea>
      this._element = this.props.type;
    }
  },
  warnRequired: function() {
    this.setState({
      warningState: 'shown',
    });

    setTimeout(() => {
      this.setState({
        warningState: 'fading',
      });
      setTimeout(() => {
        this.setState({
          warningState: 'hidden',
        });
      }, 450);
    }, 5000);
  },
  focus: function() {
    this.refs.field.focus();
  },
  getValue: function() {
    if (this.props.type == 'checkbox') {
      return this.refs.field.checked;
    } else {
      return this.refs.field.value;
    }
  },
  render: function() {
    var warningStyle = Object.assign({}, requiredFieldWarningStyle);
    if (this.state.warningState == 'fading') {
      warningStyle.opacity = '0';
    }

    // Pass all unhandled props to the field element
    var otherProps = Object.assign({}, this.props);
    delete otherProps.type;
    delete otherProps.hidden;

    return (
      <span className={this.props.hidden ? 'hidden' : ''}>
        <this._element type={this._type} name={this.props.name} ref="field" placeholder={this.props.placeholder}
          {...otherProps}>
          {this.props.children}
        </this._element>
        <span className={this.state.warningState == 'hidden' ? 'hidden' : ''} style={warningStyle}> This field is required</span>
      </span>
    );
  }
});
