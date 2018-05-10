// @flow
import * as React from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';
import ExternalLink from 'component/externalLink';

type MarkdownProps = { content: string };
type TitleProps = { children: React.Node };

const MarkdownTitle = (props: TitleProps) => {
  const { children } = props;
  return <div className="markdown-preview__title">{children}</div>;
};

const MarkdownPreview = (props: MarkdownProps) => {
  const { content } = props;
  const remarkOptions = {
    sanatize: true,
    remarkReactComponents: {
      a: ExternalLink,
      h1: MarkdownTitle,
      h2: MarkdownTitle,
      h3: MarkdownTitle,
      h4: MarkdownTitle,
      h5: MarkdownTitle,
      h6: MarkdownTitle,
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
