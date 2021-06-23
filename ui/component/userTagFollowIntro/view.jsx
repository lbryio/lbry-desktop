// @flow
import React from 'react';
import Nag from 'component/common/nag';
import TagsSelect from 'component/tagsSelect';
import Button from 'component/button';
import { Form } from 'component/common/form';
import Card from 'component/common/card';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
  followedTags: Array<Tag>,
};

function UserTagFollowIntro(props: Props) {
  const { onContinue, followedTags } = props;
  const followingCount = (followedTags && followedTags.length) || 0;

  return (
    <Card
      title={__('Tag selection')}
      subtitle={__('Select some tags to help us show you interesting things.')}
      actions={
        <React.Fragment>
          <Form onSubmit={onContinue}>
            <div className="section__actions--between">
              <span />
              <Button
                button={followedTags.length < 1 ? 'alt' : 'primary'}
                onClick={onContinue}
                label={followedTags.length < 1 ? __('Skip') : __('Continue')}
              />
            </div>
          </Form>
          <div className="section__body">
            <TagsSelect hideHeader limitShow={300} help={false} showClose={false} title={__('Follow new tags')} />
            {followingCount > 0 && (
              <Nag
                type="helpful"
                message={
                  followingCount === 1
                    ? __('You are currently following %followingCount% tag', { followingCount })
                    : __('You are currently following %followingCount% tags', { followingCount })
                }
                actionText={__('Continue')}
                onClick={onContinue}
              />
            )}
          </div>
        </React.Fragment>
      }
    />
  );
}

export default UserTagFollowIntro;
