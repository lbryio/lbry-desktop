// @flow
import React from 'react';
import classnames from 'classnames';
import parseDuration from 'parse-duration';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import usePersistedState from 'effects/use-persisted-state';
import { Modal } from 'modal/modal';
import { getChannelFromClaim } from 'util/claim';

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
  commentModBlock: (commenterUri: string, timeoutSec: ?number) => void,
  commentModBlockAsAdmin: (commenterUri: string, blockerId: string, timeoutSec: ?number) => void,
  commentModBlockAsModerator: (
    commenterUri: string,
    creatorUri: string,
    blockerId: string,
    timeoutSec: ?number
  ) => void,
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

  const contentChannelClaim = getChannelFromClaim(contentClaim);
  const activeModeratorInfo = activeChannelClaim && moderationDelegatorsById[activeChannelClaim.claim_id];
  const activeChannelIsAdmin = activeChannelClaim && activeModeratorInfo && activeModeratorInfo.global;
  const activeChannelIsModerator =
    activeChannelClaim &&
    contentChannelClaim &&
    activeModeratorInfo &&
    Object.values(activeModeratorInfo.delegators).includes(contentChannelClaim.claim_id);

  const [tab, setTab] = usePersistedState('ModalBlockChannel:tab', TAB.PERSONAL);
  const [blockType, setBlockType] = usePersistedState('ModalBlockChannel:blockType', BLOCK.PERMANENT);
  const [timeoutInput, setTimeoutInput] = usePersistedState('ModalBlockChannel:timeoutInput', '10m');
  const [timeoutInputErr, setTimeoutInputErr] = React.useState('');
  const [timeoutSec, setTimeoutSec] = React.useState(-1);

  const isPersonalTheOnlyTab = !activeChannelIsModerator && !activeChannelIsAdmin;
  const isTimeoutAvail = (contentClaim && contentClaim.is_my_output) || activeChannelIsModerator;
  const blockButtonDisabled = blockType === BLOCK.TIMEOUT && timeoutSec < 1;

  // **************************************************************************
  // **************************************************************************

  // Check settings validity on mount.
  React.useEffect(() => {
    if (
      isPersonalTheOnlyTab ||
      (tab === TAB.MODERATOR && !activeChannelIsModerator) ||
      (tab === TAB.ADMIN && !activeChannelIsAdmin)
    ) {
      setTab(TAB.PERSONAL);
    }

    if (!isTimeoutAvail && blockType === BLOCK.TIMEOUT) {
      setBlockType(BLOCK.PERMANENT);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 'timeoutInput' to 'timeoutSec' conversion.
  React.useEffect(() => {
    const handleInvalidInput = (errMsg: string) => {
      if (timeoutSec !== -1) {
        setTimeoutSec(-1);
      }
      if (timeoutInputErr !== errMsg) {
        setTimeoutInputErr(errMsg);
      }
    };

    const handleValidInput = (seconds) => {
      if (seconds !== timeoutSec) {
        setTimeoutSec(seconds);
      }
      if (timeoutInputErr) {
        setTimeoutInputErr('');
      }
    };

    if (!timeoutInput) {
      handleValidInput(-1); // Reset
      return;
    }

    const ONE_HUNDRED_YEARS_IN_SECONDS = 3154000000;
    const seconds = parseDuration(timeoutInput, 's');

    if (Number.isInteger(seconds) && seconds > 0) {
      if (seconds > ONE_HUNDRED_YEARS_IN_SECONDS) {
        handleInvalidInput(__('Wow, banned for more than 100 years?'));
      } else {
        handleValidInput(seconds);
      }
    } else {
      handleInvalidInput(__('Invalid duration.'));
    }
  }, [timeoutInput, timeoutInputErr, timeoutSec]);

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
            {contentChannelClaim
              ? __('Block this channel on behalf of %creator%.', { creator: contentChannelClaim.name })
              : __('Block this channel on behalf of the creator.')}
          </p>
        );
      case TAB.ADMIN:
        return null;
    }
  }

  function getBlockTypeElem(value, label, disabled = false, disabledLabel = '') {
    return (
      <FormField
        type="radio"
        name={value}
        key={value}
        label={disabled && disabledLabel ? __(disabledLabel) : __(label)}
        disabled={disabled}
        checked={blockType === value}
        onChange={() => setBlockType(value)}
      />
    );
  }

  function getTimeoutDurationElem() {
    const examples = '\n- 30s\n- 10m\n- 1h\n- 2d\n- 3mo\n- 1y';
    return (
      <FormField
        name="time_out"
        label={
          <>
            {__('Duration')}
            <Icon
              customTooltipText={__('Enter the timeout duration. Examples: %examples%', { examples })}
              className="icon--help"
              icon={ICONS.HELP}
              tooltip
              size={16}
            />
          </>
        }
        type="text"
        placeholder="30s, 10m, 1h, 2d, 3mo, 1y"
        value={timeoutInput}
        onChange={(e) => setTimeoutInput(e.target.value)}
        error={timeoutInputErr}
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
    const duration = blockType === BLOCK.TIMEOUT && timeoutSec > 0 ? timeoutSec : undefined;

    switch (tab) {
      case TAB.PERSONAL:
        commentModBlock(commenterUri, duration);
        break;

      case TAB.MODERATOR:
        if (activeChannelClaim && contentChannelClaim) {
          commentModBlockAsModerator(
            commenterUri,
            contentChannelClaim.permanent_url,
            activeChannelClaim.claim_id,
            duration
          );
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

  if (isPersonalTheOnlyTab && !isTimeoutAvail) {
    // There's only 1 option. Just execute it and don't show the modal.
    commentModBlock(commenterUri);
    closeModal();
    return null;
  }

  return (
    <Modal isOpen type="card" onAborted={closeModal}>
      <Card
        title={__('Block Channel')}
        subtitle={getCommenterPreview(commenterUri)}
        actions={
          <>
            {!isPersonalTheOnlyTab && (
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
                  {getBlockTypeElem(
                    BLOCK.TIMEOUT,
                    'Timeout --[time-based ban instead of permanent]--',
                    !isTimeoutAvail,
                    'Timeout (only available on content that you own)'
                  )}
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
