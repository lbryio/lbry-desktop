// @flow
import * as React from 'react';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import { Modal } from 'modal/modal';
import 'scss/component/notifications-blocked.scss';

type InlineMessageProps = {
  title: string,
  children: React.Node,
};

const InlineMessage = (props: InlineMessageProps) => {
  const { title, children } = props;
  return (
    <div className="notificationsBlocked">
      <Icon className="notificationsBlocked__icon" color="#E50054" icon={ICONS.ALERT} size={32} />
      <div>
        <span>{title}</span>
        <span className={'notificationsBlocked__subText'}>{children}</span>
      </div>
    </div>
  );
};

export const BrowserNotificationsBlocked = () => {
  return (
    <InlineMessage title={__('Heads up: browser notifications are currently blocked in this browser.')}>
      {__('To enable push notifications please configure your browser to allow notifications on odysee.com.')}
    </InlineMessage>
  );
};

export const BrowserNotificationHints = () => {
  return (
    <InlineMessage title={__("Browser notifications aren't supported. Here's a few tips:")}>
      <ul className={'notificationsBlocked__subText notificationsBlocked__subTextList'}>
        <li>{__("Notifications aren't available when in incognito or private mode.")}</li>
        <li>
          {__(
            "On Firefox, notifications won't function if cookies are set to clear on browser close. Please disable or add an exception for Odysee, then refresh."
          )}
        </li>
        <li>{__('For Brave, enable google push notifications in settings.')}</li>
        <li>{__('Check browser settings to see if notifications are disabled or otherwise restricted.')}</li>
      </ul>
    </InlineMessage>
  );
};

type ModalProps = {
  doHideModal: () => void,
};
export const BrowserNotificationErrorModal = (props: ModalProps) => {
  const { doHideModal } = props;
  return (
    <Modal type="card" isOpen onAborted={doHideModal}>
      <BrowserNotificationHints />
    </Modal>
  );
};
