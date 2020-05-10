// @flow
import * as React from 'react';
import remark from 'remark';
import remarkAttr from 'remark-attr';
import remarkStrip from 'strip-markdown';
import remarkEmoji from 'remark-emoji';
import remarkBreaks from 'remark-breaks';
import reactRenderer from 'remark-react';
import ExternalLink from 'component/externalLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';
import { formatedLinks, inlineLinks } from 'util/remark-lbry';
import { Link } from 'react-router-dom';
import { formatLbryUrlForWeb } from 'util/url';
import EmbedPlayButton from 'component/embedPlayButton';

type SimpleTextProps = {
  children?: React.Node,
};

type SimpleLinkProps = {
  href?: string,
  title?: string,
  children?: React.Node,
};

type MarkdownProps = {
  strip?: boolean,
  content: ?string,
  promptLinks?: boolean,
};

const SimpleText = (props: SimpleTextProps) => {
  return <span>{props.children}</span>;
};

const SimpleLink = (props: SimpleLinkProps) => {
  const { title, children } = props;
  const { href } = props;

  if (!href) {
    return children || null;
  }

  if (!href.startsWith('lbry://')) {
    return (
      <a href={href} title={title} target={'_blank'} rel={'noreferrer noopener'}>
        {children}
      </a>
    );
  }

  const [uri, search] = href.split('?');
  const urlParams = new URLSearchParams(search);
  const embed = urlParams.get('embed');

  if (embed) {
    return <EmbedPlayButton uri={uri} />;
  }

  const webLink = formatLbryUrlForWeb(uri);
  // using Link after formatLbryUrl to handle "/" vs "#/"
  // for web and desktop scenarios respectively

  return (
    <Link
      title={title}
      to={webLink}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {children}
    </Link>
  );
};

// Use github sanitation schema
const schema = { ...defaultSchema };

// Extend sanitation schema to support lbry protocol
schema.protocols.href.push('lbry');
schema.attributes.a.push('embed');

const REPLACE_REGEX = /(<iframe\s+src=["'])(.*?(?=))(["']\s*><\/iframe>)/g;

const MarkdownPreview = (props: MarkdownProps) => {
  const { content, strip, promptLinks } = props;
  const strippedContent = content
    ? content.replace(REPLACE_REGEX, (iframeHtml, y, iframeSrc) => {
        // Let the browser try to create an iframe to see if the markup is valid
        const outer = document.createElement('div');
        outer.innerHTML = iframeHtml;
        const iframe = ((outer.querySelector('iframe'): any): ?HTMLIFrameElement);

        if (iframe) {
          const src = iframe.src;

          if (src && src.startsWith('lbry://')) {
            return `${src}?embed=true`;
          }
        }

        return iframeHtml;
      })
    : '';

  const remarkOptions: Object = {
    sanitize: schema,
    fragment: React.Fragment,
    remarkReactComponents: {
      a: promptLinks ? ExternalLink : linkProps => <SimpleLink {...linkProps} />,
      // Workaraund of remarkOptions.Fragment
      div: React.Fragment,
    },
  };

  const remarkAttrOpts = {
    scope: 'extended',
    elements: ['link'],
    extend: { link: ['embed'] },
    defaultValue: true,
  };

  // Strip all content and just render text
  if (strip) {
    // Remove new lines and extra space
    remarkOptions.remarkReactComponents.p = SimpleText;
    return (
      <span className="markdown-preview">
        {
          remark()
            .use(remarkStrip)
            .use(reactRenderer, remarkOptions)
            .processSync(content).contents
        }
      </span>
    );
  }

  return (
    <div className="markdown-preview">
      {
        remark()
          .use(remarkAttr, remarkAttrOpts)
          // Remark plugins for lbry urls
          // Note: The order is important
          .use(formatedLinks)
          .use(inlineLinks)
          // Emojis
          .use(remarkEmoji)
          // Render new lines without needing spaces.
          .use(remarkBreaks)
          .use(reactRenderer, remarkOptions)
          .processSync(strippedContent).contents
      }
    </div>
  );
};

export default MarkdownPreview;
