// @flow
import React from 'react';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Card from 'component/common/card';
import CreditAmount from 'component/common/credit-amount';
import Empty from 'component/common/empty';
import LbcSymbol from 'component/common/lbc-symbol';
import TruncatedText from 'component/common/truncated-text';
import ChannelSelector from 'component/channelSelector';
import ClaimList from 'component/claimList';
import I18nMessage from 'component/i18nMessage';
import Spinner from 'component/spinner';
import { SBL_INVITE_STATUS } from 'constants/comment';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import useFetched from 'effects/use-fetched';
import { getHoursStr, getYesNoStr } from 'util/string';
import { isURIValid } from 'lbry-redux';

const PARAM_BLOCKLIST_ID = 'id';

type Props = {
  activeChannelClaim: ?ChannelClaim,
  sblMine: any,
  sblInvited: any,
  fetchingSblMine: boolean,
  fetchingSblInvited: boolean,
  doSblGet: (channelClaim: ?ChannelClaim, params: SblGet) => void,
  doSblListInvites: (channelClaim: ChannelClaim) => void,
  doSblAccept: (channelClaim: ChannelClaim, params: SblInviteAccept, onComplete: (err: string) => void) => void,
  doSblRescind: (channelClaim: ChannelClaim, params: SblRescind, onComplete: (err: string) => void) => void,
  doSblDelete: (channelClaim: ChannelClaim) => void,
  doOpenModal: (string, {}) => void,
  doToast: ({ message: string }) => void,
};

export default function BlockListShared(props: Props) {
  const {
    activeChannelClaim,
    sblMine,
    sblInvited,
    fetchingSblMine,
    fetchingSblInvited,
    doSblGet,
    doSblListInvites,
    doSblAccept,
    doSblRescind,
    doSblDelete,
    doOpenModal,
    doToast,
  } = props;
  const { push } = useHistory();

  const [showMembers, setShowMembers] = React.useState(false);
  const [expandInvite, setExpandInvite] = React.useState({});

  const members = sblMine && sblMine.invited_members;
  const memberUris = members && members.map((m) => `lbry://${m.invited_channel_name}#${m.invited_channel_id}`);

  // I think the only way to check if my SBL is active is by checking whether we accepted any invites to other SBLs.
  const isMySblActive = sblMine && (!sblInvited || !sblInvited.some((i) => i.invitation.status === 'accepted'));
  const mySblId = sblMine && sblMine.shared_blocked_list.id;

  const isUpdating = fetchingSblMine || fetchingSblInvited;
  const fetchedOnce = useFetched(isUpdating);

  // **************************************************************************
  // **************************************************************************

  function fetchSblInfo() {
    if (activeChannelClaim) {
      doSblGet(activeChannelClaim, {
        blocked_list_id: undefined,
        status: SBL_INVITE_STATUS.ALL,
      });

      doSblListInvites(activeChannelClaim);
    }
  }

  function handleSblDelete() {
    doOpenModal(MODALS.CONFIRM, {
      title: __('Delete'),
      body: (
        <>
          <p>{__('Are you sure you want to delete the shared blocklist?')}</p>
          <p className="empty__text">{sblMine.shared_blocked_list.name.substring(0, 256)}</p>
        </>
      ),
      onConfirm: (closeModal) => {
        if (activeChannelClaim) {
          doSblDelete(activeChannelClaim);
        }
        closeModal();
      },
    });
  }

  function handleSblAccept(sblId: number, accepted: boolean) {
    doOpenModal(MODALS.CONFIRM, {
      title: accepted ? __('Accept invite') : __('Reject invite'),
      body: accepted ? (
        <>
          <p>{__('Participate in the selected shared blocklist?')}</p>
          <p className="help">{__('Any channels that you block in the future will be added to the list.')}</p>
          <p className="help">
            {__(
              'This will become the active shared blocklist, replacing your own (if exists) or any shared blocklist that you are currently participating.'
            )}
          </p>
        </>
      ) : (
        <>
          <p>{__('Stop participating from the selected shared blocklist?')}</p>
        </>
      ),
      onConfirm: (closeModal, setIsBusy) => {
        if (activeChannelClaim) {
          const params = {
            blocked_list_id: sblId,
            accepted: accepted,
          };

          setIsBusy(true);

          doSblAccept(activeChannelClaim, params, (err: string) => {
            if (err) {
              doToast({ message: err, isError: true });
            } else {
              fetchSblInfo();
              setTimeout(() => {
                setIsBusy(false);
                closeModal();
                doToast({ message: accepted ? __('Invite accepted.') : __('Invite rejected.') });
              }, 2000);
            }
          });
        }
      },
    });
  }

  function handleRescind(memberClaim, expired) {
    doOpenModal(MODALS.CONFIRM, {
      title: expired ? __('Remove') : __('Rescind'),
      body: (
        <>
          {expired && <p>{__('Remove the invitation for the following member?')}</p>}
          {!expired && <p>{__('Rescind the invitation for the following member?')}</p>}
          <p className="empty__text">{memberClaim.name.substring(0, 256)}</p>
        </>
      ),
      onConfirm: (closeModal, setIsBusy) => {
        if (activeChannelClaim) {
          const params = {
            invited_channel_name: memberClaim.name,
            invited_channel_id: memberClaim.claim_id,
          };

          setIsBusy(true);

          doSblRescind(activeChannelClaim, params, (/* err */) => {
            // Fetch the new data and wait a bit before we dismiss the modal.
            // If you hate the hardcoded timeout, then add a callback for the
            // fetch actions.
            fetchSblInfo();
            setTimeout(() => {
              setIsBusy(false);
              closeModal();
            }, 2000);
          });
        }
      },
    });
  }

  function getHelpElem() {
    return (
      <I18nMessage
        // TODO: Need URL
        tokens={{
          learn_more: <Button button="link" label={__('Learn more')} href="https://odysee.com/@OdyseeHelp:b" />,
        }}
      >
        Shared blocklists allow a group of creators to all mutually manage a set of blocks that applies to all of their
        channels. %learn_more%
      </I18nMessage>
    );
  }

  function getRowElem(label: string, value: any, truncate: boolean = false) {
    return (
      <tr>
        <td>{label}</td>
        {truncate && (
          <td>
            <TruncatedText lines={1} text={value} showTooltip />
          </td>
        )}
        {!truncate && <td>{value}</td>}
      </tr>
    );
  }

  function getSwearJarAmountElem(amount: number) {
    return (amount && <CreditAmount amount={amount} precision={4} />) || <LbcSymbol prefix={__('---')} size={14} />;
  }

  function getSblStatusElem(active) {
    if (active) {
      return (
        <div className="sbl-status--active" title={__('This is the current active shared blocklist.')}>
          {__('Active')}
        </div>
      );
    } else {
      return (
        <div
          className="sbl-status--inactive"
          title={__('This blocklist is currently inactive. Only 1 blocklist can be active at a time.')}
        >
          {__('Inactive')}
        </div>
      );
    }
  }

  function getSblInfoElem(sbl) {
    const expanded = expandInvite[sbl.id] || sbl.id === mySblId;
    return (
      <div className="sbl-info">
        {expanded && (
          <table className="table table--condensed table--publish-preview table--no-row-lines">
            <tbody>
              {getRowElem(__('Name'), sbl.name)}
              {getRowElem(__('Description'), sbl.description)}
              {getRowElem(__('Category'), sbl.category)}
              {getRowElem(__('Strike 1'), getHoursStr(sbl.strike_one))}
              {getRowElem(__('Strike 2'), getHoursStr(sbl.strike_two))}
              {getRowElem(__('Strike 3'), getHoursStr(sbl.strike_three))}
              {getRowElem(__('Auto-appeal minimum'), getSwearJarAmountElem(sbl.curse_jar_amount))}
              {getRowElem(__('Invite expiration'), getHoursStr(sbl.invite_expiration))}
              {getRowElem(__('Allow members to invite others'), getYesNoStr(sbl.member_invite_enabled))}
            </tbody>
          </table>
        )}
        {sbl.id !== mySblId && (
          <Button
            button="link"
            className="expandable__button"
            icon={expanded ? ICONS.UP : ICONS.DOWN}
            onClick={() => setExpandInvite({ ...expandInvite, [sbl.id]: !expanded })}
          />
        )}
      </div>
    );
  }

  function getMySblElem() {
    if (sblMine) {
      const sbl = sblMine.shared_blocked_list;
      return (
        <Card
          title={
            <div>
              {__('Your Shared Blocklist')}
              {isUpdating && <Spinner type="small" />}
            </div>
          }
          actions={
            <>
              <div className="section__actions--between">
                <div className="section__actions">
                  <Button
                    button="alt"
                    label={__('Invite')}
                    title={__('Invite others to your shared blocklist.')}
                    icon={ICONS.INVITE}
                    navigate={`/$/${PAGES.SHARED_BLOCKLIST_INVITE}?${PARAM_BLOCKLIST_ID}=${sbl.id}`}
                    disabled={!isMySblActive}
                  />
                  <Button
                    button="alt"
                    label={__('Edit')}
                    title={__('Make changes to your shared blocklist.')}
                    icon={ICONS.EDIT}
                    onClick={() => {
                      push({
                        pathname: `/$/${PAGES.SHARED_BLOCKLIST_EDIT}`,
                        state: sbl,
                      });
                    }}
                  />
                  <Button
                    button="alt"
                    label={__('Delete')}
                    title={__('Delete your shared blocklist.')}
                    icon={ICONS.DELETE}
                    onClick={handleSblDelete}
                  />
                </div>
                {getSblStatusElem(isMySblActive)}
              </div>

              <div className="section__actions">{getSblInfoElem(sbl)}</div>

              <div className="section__actions">
                <Button
                  button="link"
                  label={showMembers ? __('Hide members') : __('Show members')}
                  icon={showMembers ? ICONS.UP : ICONS.DOWN}
                  onClick={() => setShowMembers(!showMembers)}
                />
              </div>

              <div className="section">{getMembersElem()}</div>
            </>
          }
        />
      );
    } else {
      return (
        <Card
          title={__('Your Shared Blocklist')}
          actions={<Button button="primary" label={__('Create list')} navigate={`/$/${PAGES.SHARED_BLOCKLIST_EDIT}`} />}
        />
      );
    }
  }

  function getMembersElem() {
    if (!showMembers) {
      return null;
    }

    const getInviteStatus = (members, claim) => {
      const member = members.find((x) => x.invited_channel_id === claim.claim_id);
      return member && member.status;
    };

    // This is required until Commentron filters bad invites.
    const sanitizedMemberUris = memberUris && memberUris.filter((uri) => isURIValid(uri));

    if (sanitizedMemberUris && sanitizedMemberUris.length > 0) {
      return (
        <ClaimList
          uris={sanitizedMemberUris}
          hideMenu
          renderProperties={(claim) => {
            const status = getInviteStatus(members, claim);
            return status === 'expired' ? (
              <div className="sbl_invite_expired">{__('Expired')}</div>
            ) : status === 'accepted' ? (
              <div className="sbl_invite_accepted">{__('Accepted')}</div>
            ) : null;
          }}
          renderActions={(claim) => {
            const expired = getInviteStatus(members, claim) === 'expired';
            return (
              <div className="section__actions">
                <Button
                  button={expired ? 'alt' : 'secondary'}
                  icon={ICONS.REMOVE}
                  label={expired ? __('Remove') : __('Rescind')}
                  onClick={() => handleRescind(claim, expired)}
                />
              </div>
            );
          }}
        />
      );
    } else {
      return <Empty text={__('No members invited.')} />;
    }
  }

  function getInvitedSblElem() {
    if (sblInvited && sblInvited.length > 0) {
      return (
        <Card
          title={__('Invitations')}
          isBodyList
          body={
            <>
              {sblInvited.map((i) => {
                return (
                  <div key={i.shared_blocked_list.id} className="card__main-actions">
                    <div className="section__actions--between">
                      <div className="section__actions">
                        <Button
                          button="alt"
                          label={i.invitation.status === 'accepted' ? __('Disable') : __('Enable')}
                          title={
                            i.invitation.status === 'accepted'
                              ? __('Stop using this blocklist.')
                              : __('Accept and activate this blocklist.')
                          }
                          icon={i.invitation.status === 'accepted' ? ICONS.REMOVE : undefined}
                          onClick={() => handleSblAccept(i.shared_blocked_list.id, i.invitation.status !== 'accepted')}
                        />
                        {i.invitation.status === 'accepted' && i.shared_blocked_list.member_invite_enabled && (
                          <Button
                            button="alt"
                            label={__('Invite')}
                            title={__('Invite others to this shared blocklist on behalf of the owner.')}
                            icon={ICONS.INVITE}
                            navigate={`/$/${PAGES.SHARED_BLOCKLIST_INVITE}?${PARAM_BLOCKLIST_ID}=${i.shared_blocked_list.id}`}
                          />
                        )}
                      </div>
                      {getSblStatusElem(i.invitation.status === 'accepted')}
                    </div>

                    <div className="section">
                      <table className="table table--condensed table--publish-preview table--no-row-lines">
                        <tbody>
                          {getRowElem(__('From'), i.invitation.invited_by_channel_name)}
                          {getRowElem(__('Message'), i.invitation.message, !expandInvite[i.shared_blocked_list.id])}
                        </tbody>
                      </table>
                      {getSblInfoElem(i.shared_blocked_list)}
                    </div>
                  </div>
                );
              })}
            </>
          }
        />
      );
    }
  }

  // **************************************************************************
  // **************************************************************************

  React.useEffect(() => {
    fetchSblInfo();
  }, [activeChannelClaim, doSblGet, doSblListInvites]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={!fetchedOnce ? 'card--disabled' : isUpdating ? 'card--disable-interaction' : ''}>
      <div className="section help--notice">{getHelpElem()}</div>
      <div className="section">
        <ChannelSelector hideAnon />
      </div>
      <div className="section sbl">{getMySblElem()}</div>
      <div className="section sbl">{getInvitedSblElem()}</div>
    </div>
  );
}
