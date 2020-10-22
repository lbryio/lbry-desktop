// @flow
import { KNOWN_APP_DOMAINS } from 'config';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid } from 'lbry-redux';
import Button from 'component/button';
import ClaimLink from 'component/claimLink';

type Props = {
  href: string,
  title?: string,
  embed?: boolean,
  children: React.Node,
  openModal: (id: string, { uri: string }) => void,
  parentCommentId?: string,
  isMarkdownPost?: boolean,
  simpleLinks?: boolean,
};

function MarkdownLink(props: Props) {
  const {
    children,
    href,
    title,
    embed = false,
    openModal,
    parentCommentId,
    isMarkdownPost,
    simpleLinks = false,
  } = props;
  const decodedUri = decodeURI(href);
  if (!href) {
    return children || null;
  }

  let element = <span>{children}</span>;

  // Regex for url protocol
  const protocolRegex = new RegExp('^(https?|lbry|mailto)+:', 'i');
  const protocol = href ? protocolRegex.exec(href) : null;

  // Return plain text if no valid url
  // Return external link if protocol is http or https
  // Return local link if protocol is lbry uri
  if (!simpleLinks && protocol && protocol[0] === 'lbry:' && isURIValid(decodedUri)) {
    const linkUrlObject = new URL(decodedUri);
    const linkDomain = linkUrlObject.host;
    const isKnownAppDomainLink = KNOWN_APP_DOMAINS.includes(linkDomain);
    let lbryUrlFromLink;
    if (isKnownAppDomainLink) {
      const linkPathname = decodeURIComponent(
        linkUrlObject.pathname.startsWith('//') ? linkUrlObject.pathname.slice(2) : linkUrlObject.pathname.slice(1)
      );
      const possibleLbryUrl = `lbry://${linkPathname.replace(/:/g, '#')}`;
      const lbryLinkIsValid = isURIValid(possibleLbryUrl);
      if (lbryLinkIsValid) {
        lbryUrlFromLink = possibleLbryUrl;
      }
    }

    element = (
      <ClaimLink
        uri={lbryUrlFromLink || decodedUri}
        autoEmbed={embed}
        parentCommentId={parentCommentId}
        isMarkdownPost={isMarkdownPost}
      >
        {children}
      </ClaimLink>
    );
  } else if (
    simpleLinks ||
    (protocol && (protocol[0] === 'http:' || protocol[0] === 'https:' || protocol[0] === 'mailto:'))
  ) {
    element = (
      <Button
        button="link"
        iconRight={ICONS.EXTERNAL}
        title={title || decodedUri}
        label={children}
        className="button--external-link"
        onClick={() => {
          openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { uri: href, isTrusted: false });
        }}
      />
    );
  }

  return <>{element}</>;
}

export default MarkdownLink;
