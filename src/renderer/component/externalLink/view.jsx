// @flow
import * as React from 'react';
import { MODALS, isURIValid } from 'lbry-redux';
import * as icons from 'constants/icons';
import Button from 'component/button';

type Props = {
  href: string,
  title?: string,
  children: React.Node,
  navigate: (string, ?{}) => void,
  openModal: ({ id: string }, { uri: string }) => void,
};

class ExternalLink extends React.PureComponent<Props> {
  static defaultProps = {
    href: null,
    title: null,
  };

  createLink() {
    const { href, title, children, openModal, navigate } = this.props;

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
          iconRight={icons.EXTERNAL_LINK}
          title={title || href}
          label={children}
          className="btn--external-link"
          onClick={() => openModal({ id: MODALS.CONFIRM_EXTERNAL_LINK }, { uri: href })}
        />
      );
    }

    // Return local link if protocol is lbry uri
    if (protocol && protocol[0] === 'lbry:' && isURIValid(href)) {
      element = (
        <Button
          button="link"
          title={title || href}
          label={children}
          onClick={() => navigate('/show', { uri: href })}
        />
      );
    }

    return element;
  }

  render() {
    const RenderLink = () => this.createLink();
    return <RenderLink />;
  }
}

export default ExternalLink;
