// @flow
import React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import { parseURI } from 'lbry-redux';

// props:
type Props = {
  uri: string,
  channelUri: string,
  createComment: params => {},
};

class CommentCreate extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
    };
    // set state or props for comment form
    (this: any).handleCommentChange = this.handleCommentChange.bind(this);
    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleCommentChange(event) {
    this.setState({ message: event.target.value });
  }

  handleChannelChange(channelUri) {
    this.setState({ channelUri: channelUri });
  }

  handleSubmit() {
    const { createComment, claim, channelUri } = this.props;
    console.log('claim', claim)
    const { claim_id: claimId } = claim;
    const { message } = this.state;
    let cmt = { message, channelId: parseURI(channelUri).claimId, claimId };
    console.log('CMT', cmt);
    console.log('PURI', claimId);
    console.log('PURI', parseURI(channelUri));
  }

  render() {
    const { channelUri } = this.props;

    return (
      <section className="card card--section">
        <Form onSubmit={this.handleSubmit}>
          <div className="card__content">
            <FormField
              type="textarea"
              name="content_description"
              label={__('Text')}
              placeholder={__('Your comment')}
              value={this.state.message}
              onChange={this.handleCommentChange}
            />
          </div>
          <div className="card__actions--between">
            <div className="card__content">
              <ChannelSection channel={channelUri} />
            </div>
            <Button button="primary" type="submit" label={__('Post')} />
          </div>
        </Form>
      </section>
    );
  }
}

export default CommentCreate;
