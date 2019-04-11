import React from 'react';
import Lbry from 'lbry-redux';
import { Form, FormField} from 'component/common/form';
import { Formik } from 'formik';
import Button from 'component/button';

class CommentCreate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Button button="primary" type="submit" label={__('Post')}/>
      </Form>

    );
  }
}
/*
<form className="form">
  <header className="card__header"><h2 className="card__header">Comments</h2></header>
  <div className="card__content">
    <FormField name="comment"
               className="form-field--stretch"
               placeholder="Leave a Comment... ">
      <fieldset>
        <input className="form-field"
               placeholder="Leave a comment..."
               type="text" value="" id="comment-field" />
        <div className="card__actions--center">
          <Button
            data-id="add-comment"
            disabled={false}
            button="primary"
            label={__('Want to comment?')}
          />
        </div>
      </fieldset>
    </FormField>
  </div>
</form>

 */
