// @flow
import * as React from 'react';
import { MODALS } from 'lbry-redux';
import Button from 'component/button';

type Props = {
  href: string,
  title?: string,
  children: React.Node,
  // navigate: (string, ?{}) => void,
  openModal: ({ id: string }, { uri: string }) => void,
};

class ExternalLink extends React.PureComponent<Props> {
  static defaultProps = {
    href: null,
    title: null,
  };

  createLink() {
    const { href, title, children, openModal } = this.props;

    // Regex for url protocol
    const protocolRegex = new RegExp('^(https?|lbry)+:', 'i');
    const protocol = href ? protocolRegex.exec(href) : null;

    // Return plain text if no valid url
    let element = <span>{children}</span>;

    // Return external link if protocol is http or https
    if (protocol && (protocol[0] === 'http:' || protocol[0] === 'https:')) {
      element = (
        <Button
          button="link"
          title={title}
          className="btn--external-link"
          onClick={() => openModal({ id: MODALS.CONFIRM_EXTERNAL_LINK }, { uri: href })}
        >
          {children}
        </Button>
      );
    }

    /* React-remark blocks the lbry protocol requires an external fix
    // Return local link if valid lbry uri
    if (protocol && protocol[0] === 'lbry:') {
      element = (
        <Button
        button="link"
        title={title}
        onClick={() => navigate('/show', { uri: href })}
        >
          {children}
        </Button>
      );
    } */

    return element;
  }

  render() {
    const RenderLink = () => this.createLink();
    return <RenderLink />;
  }
}

export default ExternalLink;
