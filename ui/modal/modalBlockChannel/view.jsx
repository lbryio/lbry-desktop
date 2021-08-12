// @flow
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import { Modal } from 'modal/modal';

const TAB = {
  PERSONAL: 'personal',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

const BLOCK = {
  PERMANENT: 'permanent',
  TIMEOUT: 'timeout',
};

type Props = {
  contentUri: string,
  commenterUri: string,
  // --- select ---
  activeChannelClaim: ?ChannelClaim,
  contentClaim: ?Claim,
  moderationDelegatorsById: { [string]: { global: boolean, delegators: { name: string, claimId: string } } },
  // --- perform ---
  closeModal: () => void,
  commentModBlock: (string, ?number) => void,
  commentModBlockAsAdmin: (string, string, ?number) => void,
  commentModBlockAsModerator: (string, string, string, ?number) => void,
};

export default function ModalBlockChannel(props: Props) {
  const {
    commenterUri,
    activeChannelClaim,
    contentClaim,
    moderationDelegatorsById,
    closeModal,
    commentModBlock,
    commentModBlockAsAdmin,
    commentModBlockAsModerator,
  } = props;

  const contentChannelClaim = !contentClaim
    ? null
    : contentClaim.value_type === 'channel'
    ? contentClaim
    : contentClaim.signing_channel && contentClaim.is_channel_signature_valid
    ? contentClaim.signing_channel
    : null;

  const activeModeratorInfo = activeChannelClaim && moderationDelegatorsById[activeChannelClaim.claim_id];
  const activeChannelIsAdmin = activeChannelClaim && activeModeratorInfo && activeModeratorInfo.global;
  const activeChannelIsModerator =
    activeChannelClaim &&
    contentChannelClaim &&
    activeModeratorInfo &&
    Object.values(activeModeratorInfo.delegators).includes(contentChannelClaim.claim_id);

  const [tab, setTab] = usePersistedState('ModalBlockChannel:tab', TAB.PERSONAL);
  const [blockType, setBlockType] = usePersistedState('ModalBlockChannel:blockType', BLOCK.PERMANENT);
  const [timeoutHrs, setTimeoutHrs] = usePersistedState('ModalBlockChannel:timeoutHrs', 1);
  const [timeoutHrsError, setTimeoutHrsError] = React.useState('');

  const personalIsTheOnlyTab = !activeChannelIsModerator && !activeChannelIsAdmin;
  const blockButtonDisabled = blockType === BLOCK.TIMEOUT && (timeoutHrs === 0 || !Number.isInteger(timeoutHrs));

  // **************************************************************************
  // **************************************************************************

  // Check 'tab' validity on mount.
  React.useEffect(() => {
    if (
      personalIsTheOnlyTab ||
      (tab === TAB.MODERATOR && !activeChannelIsModerator) ||
      (tab === TAB.ADMIN && !activeChannelIsAdmin)
    ) {
      setTab(TAB.PERSONAL);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 'timeoutHrs' sanity check.
  React.useEffect(() => {
    if (Number.isInteger(timeoutHrs) && timeoutHrs > 0) {
      if (timeoutHrsError) {
        setTimeoutHrsError('');
      }
    } else {
      if (!timeoutHrsError) {
        setTimeoutHrsError('Invalid duration.');
      }
    }
  }, [timeoutHrs, timeoutHrsError]);

  // **************************************************************************
  // **************************************************************************

  function getTabElem(value, label) {
    return (
      <Button
        key={value}
        label={__(label)}
        button="alt"
        onClick={() => setTab(value)}
        className={classnames('button-toggle', { 'button-toggle--active': tab === value })}
      />
    );
  }

  function getTabHelperElem(tab) {
    switch (tab) {
      case TAB.PERSONAL:
        return null;
      case TAB.MODERATOR:
        return (
          <p className="help">
            {__('Block this channel on behalf of %creator%', {
              creator: contentChannelClaim ? contentChannelClaim.name : __('creator'),
            })}
          </p>
        );
      case TAB.ADMIN:
        return null;
    }
  }

  function getBlockTypeElem(value, label) {
    return (
      <FormField
        type="radio"
        name={value}
        key={value}
        label={__(label)}
        checked={blockType === value}
        onChange={() => setBlockType(value)}
      />
    );
  }

  function getTimeoutDurationElem() {
    return (
      <FormField
        name="time_out_hrs"
        label={__('Hours')}
        className="form-field--price-amount"
        max="1000"
        min="1"
        step="1"
        type="number"
        placeholder="1"
        value={timeoutHrs}
        onChange={(e) => setTimeoutHrs(parseInt(e.target.value))}
        error={timeoutHrsError}
      />
    );
  }

  function getCommenterPreview(uri) {
    return (
      <div className="content__non-clickable">
        <ClaimPreview uri={uri} hideMenu hideActions type="small" />
      </div>
    );
  }

  function getActiveChannelElem() {
    return activeChannelClaim ? (
      <div className="block-modal--active-channel">
        <ChannelThumbnail xsmall noLazyLoad uri={activeChannelClaim.permanent_url} />
        <div className="block-modal--active-channel-label">
          {__('Interacting as %channelName%', { channelName: activeChannelClaim.name })}
        </div>
      </div>
    ) : null;
  }

  function handleBlock() {
    const duration = blockType === BLOCK.TIMEOUT && timeoutHrs ? timeoutHrs : undefined;

    switch (tab) {
      case TAB.PERSONAL:
        commentModBlock(commenterUri, duration);
        break;

      case TAB.MODERATOR:
        if (activeChannelClaim && contentChannelClaim) {
          commentModBlockAsModerator(commenterUri, contentChannelClaim.claim_id, activeChannelClaim.claim_id, duration);
        }
        break;

      case TAB.ADMIN:
        if (activeChannelClaim) {
          commentModBlockAsAdmin(commenterUri, activeChannelClaim.claim_id, duration);
        }
        break;
    }

    closeModal();
  }

  // **************************************************************************
  // **************************************************************************

  return (
    <Modal isOpen type="card" onAborted={closeModal}>
      <Card
        title={__('Block Channel')}
        subtitle={getCommenterPreview(commenterUri)}
        actions={
          <>
            {!personalIsTheOnlyTab && (
              <div className="section__actions">
                <div className="section">
                  <label>{__('Block list')}</label>
                  <div className="block-modal--values">
                    {getTabElem(TAB.PERSONAL, 'Personal')}
                    {activeChannelIsModerator && getTabElem(TAB.MODERATOR, 'Moderator')}
                    {activeChannelIsAdmin && getTabElem(TAB.ADMIN, 'Global Admin')}
                    {getTabHelperElem(tab)}
                  </div>
                </div>
              </div>
            )}

            <div className="section section--vertical-compact">
              <label>{__('Duration')}</label>
              <div className="block-modal--values">
                <fieldset>
                  {getBlockTypeElem(BLOCK.PERMANENT, 'Permanent')}
                  {getBlockTypeElem(BLOCK.TIMEOUT, 'Timeout')}
                </fieldset>
                {blockType === BLOCK.TIMEOUT && getTimeoutDurationElem()}
              </div>
            </div>

            <div className="block-modal--finalize">
              <div className="section__actions">
                <Button button="primary" label={__('Block')} onClick={handleBlock} disabled={blockButtonDisabled} />
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
                {getActiveChannelElem()}
              </div>
            </div>
          </>
        }
      />
    </Modal>
  );
}
