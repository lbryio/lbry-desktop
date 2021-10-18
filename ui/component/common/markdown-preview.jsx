// @flow
import * as React from 'react';
import classnames from 'classnames';
import remark from 'remark';
import remarkAttr from 'remark-attr';
import remarkStrip from 'strip-markdown';
import remarkEmoji from 'remark-emoji';
import remarkBreaks from 'remark-breaks';
import remarkFrontMatter from 'remark-frontmatter';
import reactRenderer from 'remark-react';
import MarkdownLink from 'component/markdownLink';
import defaultSchema from 'hast-util-sanitize/lib/github.json';
import { formatedLinks, inlineLinks } from 'util/remark-lbry';
import { formattedTimestamp, inlineTimestamp } from 'util/remark-timestamp';
import ZoomableImage from 'component/zoomableImage';
import { CHANNEL_STAKED_LEVEL_VIDEO_COMMENTS } from 'config';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type SimpleTextProps = {
  children?: React.Node,
};

type SimpleLinkProps = {
  href?: string,
  title?: string,
  children?: React.Node,
};

type ImageLinkProps = {
  src: string,
  title?: string,
  alt?: string,
  helpText?: string,
};

type MarkdownProps = {
  strip?: boolean,
  content: ?string,
  simpleLinks?: boolean,
  noDataStore?: boolean,
  className?: string,
  parentCommentId?: string,
  isMarkdownPost?: boolean,
  stakedLevel?: number,
};

// ****************************************************************************
// ****************************************************************************

const SimpleText = (props: SimpleTextProps) => {
  return <span>{props.children}</span>;
};

// ****************************************************************************
// ****************************************************************************

const SimpleLink = (props: SimpleLinkProps) => {
  const { title, children, href } = props;

  if (!href) {
    return children || null;
  }

  if (!href.startsWith('lbry:/')) {
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
    // Decode this since users might just copy it from the url bar
    const decodedUri = decodeURI(uri);
    return (
      <div className="embed__inline-button-preview">
        <pre>{decodedUri}</pre>
      </div>
    );
  }

  // Dummy link (no 'href')
  return <a title={title}>{children}</a>;
};

// ****************************************************************************
// ****************************************************************************

const SimpleImageLink = (props: ImageLinkProps) => {
  const { src, title, alt, helpText } = props;
  if (!src) {
    return null;
  }

  return (
    <Button
      button="link"
      iconRight={ICONS.EXTERNAL}
      label={title || alt || src}
      title={helpText || title || alt || src}
      className="button--external-link"
      href={src}
    />
  );
};

// ****************************************************************************
// ****************************************************************************

// Use github sanitation schema
const schema = { ...defaultSchema };

// Extend sanitation schema to support lbry protocol
schema.protocols.href.push('lbry');
schema.attributes.a.push('embed');

const REPLACE_REGEX = /(<iframe\s+src=["'])(.*?(?=))(["']\s*><\/iframe>)/g;

// ****************************************************************************
// ****************************************************************************

function isStakeEnoughForPreview(stakedLevel) {
  return !stakedLevel || stakedLevel >= CHANNEL_STAKED_LEVEL_VIDEO_COMMENTS;
}

// ****************************************************************************
// ****************************************************************************

const MarkdownPreview = (props: MarkdownProps) => {
  const { content, strip, simpleLinks, noDataStore, className, parentCommentId, isMarkdownPost, stakedLevel } = props;
  const strippedContent = content
    ? content.replace(REPLACE_REGEX, (iframeHtml, y, iframeSrc) => {
        // Let the browser try to create an iframe to see if the markup is valid
        const outer = document.createElement('div');
        outer.innerHTML = iframeHtml;
        const iframe = ((outer.querySelector('iframe'): any): ?HTMLIFrameElement);

        if (iframe) {
          const src = iframe.src;

          if (src && src.startsWith('lbry://')) {
            return src;
          }
        }

        return iframeHtml;
      })
    : '';

  const remarkOptions: Object = {
    sanitize: schema,
    fragment: React.Fragment,
    remarkReactComponents: {
      a: noDataStore
        ? SimpleLink
        : (linkProps) => (
            <MarkdownLink
              {...linkProps}
              parentCommentId={parentCommentId}
              isMarkdownPost={isMarkdownPost}
              simpleLinks={simpleLinks}
              allowPreview={isStakeEnoughForPreview(stakedLevel)}
            />
          ),
      // Workaraund of remarkOptions.Fragment
      div: React.Fragment,
      img: isStakeEnoughForPreview(stakedLevel)
        ? ZoomableImage
        : (imgProps) => <SimpleImageLink src={imgProps.src} alt={imgProps.alt} title={imgProps.title} />,
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
      <span dir="auto" className="markdown-preview">
        {
          remark()
            .use(remarkStrip)
            .use(remarkFrontMatter, ['yaml'])
            .use(reactRenderer, remarkOptions)
            .processSync(content).contents
        }
      </span>
    );
  }

  return (
    <div dir="auto" className={classnames('markdown-preview', className)}>
      {
        remark()
          .use(remarkAttr, remarkAttrOpts)
          // Remark plugins for lbry urls
          // Note: The order is important
          .use(formatedLinks)
          .use(inlineLinks)
          .use(isMarkdownPost ? null : inlineTimestamp)
          .use(isMarkdownPost ? null : formattedTimestamp)
          // Emojis
          .use(remarkEmoji)
          // Render new lines without needing spaces.
          .use(remarkBreaks)
          .use(remarkFrontMatter, ['yaml'])
          .use(reactRenderer, remarkOptions)
          .processSync(strippedContent).contents
      }
    </div>
  );
};

export default MarkdownPreview;
