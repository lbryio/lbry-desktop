// @flow
import React from 'react';
import { MODALS } from 'lbry-redux';
import Button from 'component/button';

type Props = {
  href?: string,
  title?: string,
  children: React.Node,
  openModal: string => void,
};

class ExternalLink extends React.PureComponent<Props> {
  static defaultProps = {
    href: null,
    title: null,
  };
  render() {
    const { href, title, children, openModal } = this.props;
    return href ? (
      <Button
        button="link"
        title={title}
        onClick={() => openModal({ id: MODALS.CONFIRM_EXTERNAL_LINK }, { url: href })}
      >
        {children}
      </Button>
    ) : (
      <span>children</span>
    );
  }
}

export default ExternalLink;
