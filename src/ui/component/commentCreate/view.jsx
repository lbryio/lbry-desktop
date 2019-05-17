// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';

type Props = {
  comment: string,
  claimId: string,
  authorChannelId: string,
};

class CommentCreate extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: 'Anonymous',
      comment: '',
      channelId: '',
    };
    (this: any).handleCommentChange = this.handleCommentChange.bind(this);
    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
  }

  handleCommentChange(event) {
    this.setState({ comment: event.comment.target.value });
  }

  handleChannelChange(channel) {
    this.setState({ channel: channel });
  }

  render() {
    console.log(this.state);
    return (
      <section className="card card--section">
        <div className="card__content">
          <FormField
            type="textarea"
            name="content_description"
            label={__('Text')}
            placeholder={__('Your comment')}
            value={this.state.comment}
            onChange={text => this.handleCommentChange({ comment: text })}
          />
        </div>
        <div className="card__actions--between">
          <div className="card__content">
            <ChannelSection channel={this.state.channel} onChannelChange={this.handleChannelChange} />
          </div>
          <Button button="primary" type="submit" label={__('Post')} />
        </div>
      </section>
    );
  }
}

export default CommentCreate;
