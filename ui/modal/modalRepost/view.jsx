// @flow
import { CHANNEL_NEW, MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import ErrorText from 'component/common/error-text';
import { FormField } from 'component/common/form';
import { parseURI, isNameValid, creditsToString } from 'lbry-redux';

type Props = {
  doHideModal: () => void,
  doToast: ({ message: string }) => void,
  doClearRepostError: () => void,
  doRepost: StreamRepostOptions => Promise<*>,
  title: string,
  claim: ?StreamClaim,
  balance: number,
  channels: ?Array<ChannelClaim>,
  error: ?string,
  reposting: boolean,
};

function ModalRepost(props: Props) {
  const {
    doHideModal,
    doToast,
    doClearRepostError,
    doRepost,
    title,
    claim,
    balance,
    channels,
    error,
    reposting,
  } = props;
  const defaultName = claim && `${claim.name}-repost`;
  const originalClaimId = claim && claim.claim_id;

  const [repostChannel, setRepostChannel] = React.useState<?{ claimId: string, name: string }>();
  const [showAdvanced, setShowAdvanced] = React.useState();
  const [repostBid, setRepostBid] = React.useState(0.1);
  const [repostName, setRepostName] = React.useState(defaultName);
  const [repostNameError, setRepostNameError] = React.useState();
  const [repostBidError, setRepostBidError] = React.useState();

  const channelStrings = channels && channels.map(channel => channel.permanent_url).join(',');
  React.useEffect(() => {
    if (!repostChannel && channelStrings) {
      const channels = channelStrings.split(',');
      const newChannelUrl = channels[0];
      const { claimName, claimId } = parseURI(newChannelUrl);
      setRepostChannel({ name: claimName, claimId });
    }
  }, [channelStrings]);

  React.useEffect(() => {
    let bidError;
    if (repostBid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (balance === repostBid) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    } else if (balance < repostBid) {
      bidError = __('Deposit cannot be higher than your balance');
    } else if (repostBid < MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    }

    setRepostBidError(bidError);
  }, [repostBid, balance]);

  React.useEffect(() => {
    let nameError;
    if (!repostName) {
      nameError = __('A name is required');
    } else if (!isNameValid(repostName, false)) {
      nameError = INVALID_NAME_ERROR;
    }

    setRepostNameError(nameError);
  }, [repostName]);

  function handleSubmit() {
    if (repostName && repostBid && repostChannel && originalClaimId) {
      doRepost({
        name: repostName,
        bid: creditsToString(repostBid),
        channel_id: repostChannel.claimId,
        claim_id: originalClaimId,
      }).then(() => {
        doHideModal();
        doToast({ message: __('Woohoo! Sucessfully reposted this claim.') });
      });
    }
  }

  function handleCloseModal() {
    doClearRepostError();
    doHideModal();
  }

  return (
    <Modal isOpen type="card" onAborted={handleCloseModal} onConfirmed={handleCloseModal}>
      <Card
        title={
          <span>
            Repost <em>{title}</em>
          </span>
        }
        subtitle={
          error && <ErrorText>{__('There was an error reposting this claim. Please try again later.')}</ErrorText>
        }
        body={
          <div>
            <SelectChannel
              label="Channel to repost on"
              hideAnon
              channel={repostChannel ? repostChannel.name : undefined}
              onChannelChange={newChannel => setRepostChannel(newChannel)}
            />
            <div className="section__actions">
              {!showAdvanced && (
                <Button
                  button="link"
                  label={showAdvanced ? 'Hide' : __('Advanced')}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                />
              )}
            </div>
            {showAdvanced && (
              <React.Fragment>
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  <fieldset-section>
                    <label>{__('Name')}</label>
                    <div className="form-field__prefix">{`lbry://${
                      !repostChannel || repostChannel.name === CHANNEL_NEW ? '' : `${repostChannel.name}/`
                    }`}</div>
                  </fieldset-section>
                  <FormField
                    type="text"
                    name="repost_name"
                    value={repostName}
                    error={repostNameError}
                    onChange={event => setRepostName(event.target.value)}
                  />
                </fieldset-group>
                <div className="form-field__help">
                  {__('The name of your repost, something about reposting to help search')}
                </div>

                <FormField
                  type="number"
                  name="repost_bid"
                  min="0"
                  step="any"
                  placeholder="0.123"
                  className="form-field--price-amount"
                  label={__('Deposit (LBC)')}
                  postfix="LBC"
                  value={repostBid}
                  error={repostBidError}
                  disabled={!repostName}
                  onChange={event => setRepostBid(parseFloat(event.target.value))}
                  onWheel={e => e.stopPropagation()}
                />
              </React.Fragment>
            )}
          </div>
        }
        actions={
          <React.Fragment>
            <Button
              disabled={reposting || repostBidError || repostNameError}
              button="primary"
              label={reposting ? __('Reposting') : __('Repost')}
              onClick={handleSubmit}
            />
            <Button button="link" label={__('Cancel')} onClick={handleCloseModal} />
          </React.Fragment>
        }
      />
    </Modal>
  );
}

export default ModalRepost;
