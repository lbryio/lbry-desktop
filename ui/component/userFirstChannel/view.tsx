import React, { useState } from "react";
import { isNameValid } from "util/lbryURI";
import Button from "component/button";
import { Form, FormField } from "component/common/form";
import { INVALID_NAME_ERROR } from "constants/claim";
import Card from "component/common/card";
import I18nMessage from "component/i18nMessage";
import analytics from "analytics";

export const DEFAULT_BID_FOR_FIRST_CHANNEL = 0.01;

type Props = {
  createChannel: (arg1: string, arg2: number) => Promise<ChannelClaim>;
  creatingChannel: boolean;
  createChannelError: string;
  claimingReward: boolean;
  user: User;
  doToggleInterestedInYoutubeSync: () => void;
};

function UserFirstChannel(props: Props) {
  const { createChannel, creatingChannel, claimingReward, user, createChannelError, doToggleInterestedInYoutubeSync } =
    props;
  const { primary_email: primaryEmail } = user;
  const initialChannel = primaryEmail ? primaryEmail.split("@")[0] : "";
  const [channel, setChannel] = useState(initialChannel);
  const [nameError, setNameError] = useState(undefined);

  function handleCreateChannel() {
    createChannel(`@${channel}`, DEFAULT_BID_FOR_FIRST_CHANNEL).then((channelClaim) => {
      if (channelClaim) {
        analytics.apiLogPublish(channelClaim);
      }
    });
  }

  function handleChannelChange(e: unknown) {
    // @ts-expect-error - TS2339 - Property 'target' does not exist on type 'unknown'.
    const { value } = e.target;
    setChannel(value);
    if (!isNameValid(value)) {
      setNameError(INVALID_NAME_ERROR);
    } else {
      // @ts-expect-error - TS2554 - Expected 1 arguments, but got 0.
      setNameError();
    }
  }

  return (
    <div className="main__channel-creation">
      <Card
        title={__("Create a Channel")}
        subtitle={
          <React.Fragment>
            <p>{__("Your channel will be used for publishing and commenting.")}</p>
            <p>{__("You can have more than one or remove it later.")}</p>
          </React.Fragment>
        }
        actions={
          <Form onSubmit={handleCreateChannel}>
            {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
            <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
              {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              <fieldset-section>
                <label htmlFor="auth_first_channel">
                  {createChannelError || nameError ? (
                    <span className="error__text">{createChannelError || nameError}</span>
                  ) : (
                    __("Your Channel")
                  )}
                </label>
                <div className="form-field__prefix">@</div>
                {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              </fieldset-section>

              <FormField
                autoFocus
                placeholder={__("channel")}
                type="text"
                name="auth_first_channel"
                // @ts-expect-error - TS2322 - Type '{ autoFocus: true; placeholder: string; type: string; name: string; className: string; value: string; onChange: (e: unknown) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                className="form-field--short"
                value={channel}
                onChange={handleChannelChange}
              />
              {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
            </fieldset-group>
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                type="submit"
                disabled={nameError || !channel || creatingChannel || claimingReward}
                label={creatingChannel || claimingReward ? __("Creating") : __("Create")}
              />
            </div>
            <div className="help--card-actions">
              {/* @ts-expect-error - TS2745 (ts-migration) */}
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  sync_channel: (
                    <Button
                      // @ts-expect-error - TS2322 (ts-migration)
                      button="link"
                      label={__("Sync it and skip this step")}
                      onClick={() => doToggleInterestedInYoutubeSync()}
                    />
                  ),
                }}
              >
                Have a YouTube channel? %sync_channel%.
              </I18nMessage>
            </div>
          </Form>
        }
      />
    </div>
  );
}

export default UserFirstChannel;
