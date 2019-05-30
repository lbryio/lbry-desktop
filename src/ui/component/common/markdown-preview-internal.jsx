// @flow
import * as React from 'react';
import remark from 'remark';
import remarkLBRY from 'util/remark-lbry';
import remarkEmoji from 'remark-emoji';
import reactRenderer from 'remark-react';
import ExternalLink from 'component/externalLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';

type MarkdownProps = {
  content: ?string,
  promptLinks?: boolean,
};

type SimpleLinkProps = {
  href?: string,
  title?: string,
  children?: React.Node,
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

const MarkdownPreview = (props: MarkdownProps) => {
  const { content, promptLinks } = props;
  const remarkOptions = {
    sanitize: schema,
    remarkReactComponents: {
      a: promptLinks ? ExternalLink : SimpleLink,
    },
  };
  return (
    <div className="markdown-preview">
      {
        remark()
          .use(remarkLBRY)
          .use(remarkEmoji)
          .use(reactRenderer, remarkOptions)
          .processSync(content).contents
      }
    </div>
  );
};

export default MarkdownPreview;
