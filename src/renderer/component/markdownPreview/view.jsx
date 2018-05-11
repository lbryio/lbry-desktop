// @flow
import * as React from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';
import ExternalLink from 'component/externalLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';

// Use github sanitation schema
const schema = { ...defaultSchema };

// Extend sanitation schema to support lbry protocol
schema.protocols.href[3] = 'lbry';

type MarkdownProps = { content: string };

const MarkdownPreview = (props: MarkdownProps) => {
  const { content } = props;
  const remarkOptions = {
    sanitize: schema,
    remarkReactComponents: {
      a: ExternalLink,
    },
  };
  return (
    <div className="markdown-preview">
      {
        remark()
          .use(reactRenderer, remarkOptions)
          .processSync(content).contents
      }
    </div>
  );
};

export default MarkdownPreview;
