// @flow
import * as React from 'react';
import remark from 'remark';
import remarkAttr from 'remark-attr';
import remarkStrip from 'strip-markdown';
import remarkEmoji from 'remark-emoji';
import reactRenderer from 'remark-react';
import ExternalLink from 'component/externalLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';
import { formatedLinks, inlineLinks } from 'util/remark-lbry';

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
  const { href, title, children } = props;
  return (
    <a href={href} title={title}>
      {children}
    </a>
  );
};

// Use github sanitation schema
const schema = { ...defaultSchema };

// Extend sanitation schema to support lbry protocol
schema.protocols.href.push('lbry');
schema.attributes.a.push('embed');

const MarkdownPreview = (props: MarkdownProps) => {
  const { content, strip, promptLinks } = props;

  const remarkOptions: Object = {
    sanitize: schema,
    fragment: React.Fragment,
    remarkReactComponents: {
      a: promptLinks ? ExternalLink : SimpleLink,
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
          .use(reactRenderer, remarkOptions)
          .processSync(content).contents
      }
    </div>
  );
};

export default MarkdownPreview;
