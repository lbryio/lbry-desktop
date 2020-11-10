// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
  fileAction?: boolean,
  disableSupport: boolean,
  user: ?User,
};

export default function ClaimSupportButton(props: Props) {
  const { doOpenModal, uri, fileAction, disableSupport, user } = props;
  const [showNudge, setShowNudge] = React.useState(false);
  const [nudgeAcknowledged, setNudgeAcknowledged] = usePersistedState('nudge:support-acknowledge', false);
  const emailVerified = user && user.has_verified_email;

  React.useEffect(() => {
    if (!emailVerified && !nudgeAcknowledged && fileAction) {
      setShowNudge(true);
    }
  }, [emailVerified, nudgeAcknowledged, fileAction]);

  if (disableSupport) {
    return null;
  }

  return (
    <>
      <Button
        button={fileAction ? undefined : 'alt'}
        className={classnames({ 'button--file-action': fileAction, 'button--highlighted': showNudge })}
        icon={ICONS.LBC}
        iconSize={fileAction ? 22 : undefined}
        label={__('Support --[button to support a claim]--')}
        requiresAuth={IS_WEB}
        title={__('Support this claim')}
        onClick={() => doOpenModal(MODALS.SEND_TIP, { uri, isSupport: true })}
      />
      {showNudge && (
        <div className="nudge">
          <div className="nudge__wrapper">
            <span className="nudge__text">{__('Create an account to support this creator!')}</span>
            <Button
              className="nudge__close"
              button="close"
              icon={ICONS.REMOVE}
              onClick={() => {
                setNudgeAcknowledged(true);
                setShowNudge(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
