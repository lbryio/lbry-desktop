// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid } from 'lbry-redux';
import Button from 'component/button';

type Props = {
  href: string,
  title?: string,
  children: React.Node,
  openModal: (id: string, { uri: string }) => void,
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
          iconRight={ICONS.EXTERNAL}
          title={title || href}
          label={children}
          className="button--external-link"
          onClick={() => openModal(MODALS.CONFIRM_EXTERNAL_LINK, { uri: href })}
        />
      );
    }

    // Return local link if protocol is lbry uri
    if (protocol && protocol[0] === 'lbry:' && isURIValid(href)) {
      element = <Button button="link" title={title || href} label={children} navigate={href} />;
    }

    return element;
  }

  render() {
    const RenderLink = () => this.createLink();
    return <RenderLink />;
  }
}

export default ExternalLink;
