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
  getSelectedElement: function() {
    return this.refs.field.options[this.refs.field.selectedIndex];
  },
  render: function() {
    // Pass all unhandled props to the field element
    var otherProps = Object.assign({}, this.props);
    delete otherProps.type;
    delete otherProps.hidden;

    return (
      <div className={'form-field-container' + (this.props.hidden ? ' hidden' : '')}>
        <this._element type={this._type} className="form-field" name={this.props.name} ref="field" placeholder={this.props.placeholder}
          {...otherProps}>
          {this.props.children}
        </this._element>
        <FormFieldAdvice field={this.refs.field} state={this.state.warningState}>This field is required</FormFieldAdvice>
      </div>
    );
  }
});

var FormFieldAdvice = React.createClass({
  propTypes: {
    state: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      this.props.state != 'hidden'
        ? <div className="form-field-advice-container">
            <div className={'form-field-advice' + (this.props.state == 'fading' ? ' form-field-advice--fading' : '')}>
              <Icon icon="icon-caret-up" className="form-field-advice__arrow" />
              <div className="form-field-advice__content-container">
                <span className="form-field-advice__content">
                  {this.props.children}
                </span>
              </div>
            </div>
          </div>
        : null
    );
  }
});
