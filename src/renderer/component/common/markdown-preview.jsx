// @flow
import * as React from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';
import remarkEmoji from 'remark-emoji';
import ExternalLink from 'component/externalLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';

// Use github sanitation schema
const schema = { ...defaultSchema };

// Extend sanitation schema to support lbry protocol
schema.protocols.href[3] = 'lbry';

type MarkdownProps = {
  content: string,
  promptLinks?: boolean,
};

const SimpleLink = ({ href, title, children }) => (
  <a href={href} title={title}>
    {children}
  </a>
);

const MarkdownPreview = (props: MarkdownProps) => {
  const { content, externalLinks, promptLinks } = props;
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
          .use(remarkEmoji)
          .use(reactRenderer, remarkOptions)
          .processSync(content).contents
      }
    </div>
  );
};

export default MarkdownPreview;
