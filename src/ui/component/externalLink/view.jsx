// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid } from 'lbry-redux';
import Button from 'component/button';
import ClaimLink from 'component/claimLink';
import { isLBRYDomain } from 'util/uri';

type Props = {
  href: string,
  title?: string,
  embed?: boolean,
  children: React.Node,
  openModal: (id: string, { uri: string }) => void,
};

class ExternalLink extends React.PureComponent<Props> {
  static defaultProps = {
    href: null,
    title: null,
    embed: false,
  };

  createLink() {
    const { href, title, embed, children, openModal } = this.props;
    // Regex for url protocol
    const protocolRegex = new RegExp('^(https?|lbry|mailto)+:', 'i');
    const protocol = href ? protocolRegex.exec(href) : null;
    // Return plain text if no valid url
    let element = <span>{children}</span>;
    // Return external link if protocol is http or https
    if (protocol && (protocol[0] === 'http:' || protocol[0] === 'https:' || protocol[0] === 'mailto:')) {
      element = (
        <Button
          button="link"
          iconRight={ICONS.EXTERNAL}
          title={title || href}
          label={children}
          className="button--external-link"
          onClick={() => {
            const isTrusted = isLBRYDomain(href);
            openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { uri: href, isTrusted: isTrusted });
          }}
        />
      );
    }
    // Return local link if protocol is lbry uri
    if (protocol && protocol[0] === 'lbry:' && isURIValid(href)) {
      element = (
        <ClaimLink uri={href} autoEmbed={embed}>
          {children}
        </ClaimLink>
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
