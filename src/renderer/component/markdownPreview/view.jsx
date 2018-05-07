// @flow
import * as React from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';
import Button from 'component/button';

type Props = {
  children: React.Node,
};

const TitleMarkdown = (props: Props) => {
  const { children } = props;
  return <div className="markdown-preview__title">{children}</div>;
};

const LinkMarkDown = (props: Props) => {
  const { children } = props;
  return (
    <Button button="link" {...props}>
      {children}
    </Button>
  );
};

type MarkdownProps = {
  content: string,
};

const MarkdownPreview = (props: MarkdownProps) => {
  const { content } = props;
  const remarkOptions = {
    sanatize: true,
    remarkReactComponents: {
      a: LinkMarkDown,
      h1: TitleMarkdown,
      h2: TitleMarkdown,
      h3: TitleMarkdown,
      h4: TitleMarkdown,
      h5: TitleMarkdown,
      h6: TitleMarkdown,
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
