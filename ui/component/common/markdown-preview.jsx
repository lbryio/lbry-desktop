// @flow
import { CHANNEL_STAKED_LEVEL_VIDEO_COMMENTS, MISSING_THUMB_DEFAULT } from 'config';
import { platform } from 'util/platform';
import { formattedEmote, inlineEmote } from 'util/remark-emote';
import { formattedLinks, inlineLinks } from 'util/remark-lbry';
import { formattedTimestamp, inlineTimestamp } from 'util/remark-timestamp';
import { getThumbnailCdnUrl, getImageProxyUrl } from 'util/thumbnail';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import defaultSchema from 'hast-util-sanitize/lib/github.json';
import MarkdownLink from 'component/markdownLink';
import OptimizedImage from 'component/optimizedImage';
import reactRenderer from 'remark-react';
import remark from 'remark';
import remarkAttr from 'remark-attr';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import remarkFrontMatter from 'remark-frontmatter';
import remarkStrip from 'strip-markdown';
import ZoomableImage from 'component/zoomableImage';
import { TWEMOTEARRAY } from 'constants/emotes';
const visit = require('unist-util-visit');
const RE_EMOTE = /:\+1:|:-1:|:[\w-]+:/;

function isEmote(title, src) {
  return (
    title &&
    RE_EMOTE.test(title) &&
    (src.includes('static.odycdn.com/emoticons') || src.includes('/public/img/emoticons'))
  );
}

function isStakeEnoughForPreview(stakedLevel) {
  return !stakedLevel || stakedLevel >= CHANNEL_STAKED_LEVEL_VIDEO_COMMENTS;
}

type SimpleTextProps = {
  children?: React.Node,
};

type SimpleLinkProps = {
  href?: string,
  title?: string,
  embed?: boolean,
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
  disableTimestamps?: boolean,
  stakedLevel?: number,
  setUserMention?: (boolean) => void,
  hasMembership?: boolean,
  isComment?: boolean,
  isMinimal?: boolean,
};

// ****************************************************************************
// ****************************************************************************

const SimpleText = (props: SimpleTextProps) => {
  return <span>{props.children}</span>;
};

const remarkTwemoji = (tree) => {
  const RE_TWEMOJI = new RegExp(
    '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])'
  );

  function transformer(tree) {
    visit(tree, 'text', (node) => {
      if (RE_TWEMOJI.test(node.value)) {
        let code = node.value.match(RE_TWEMOJI)[0];
        // $FlowIgnore
        const emote = TWEMOTEARRAY.find(({ unicode }) => code === unicode);

        if (emote) {
          node.type = 'image';
          node.url = emote.url;
          node.title = emote.name;
          node.children = [{ type: 'text', value: emote.name }];
          if (!node.data || !node.data.hProperties) {
            // Create new node data
            node.data = {
              hProperties: { emote: true },
            };
          } else if (node.data.hProperties) {
            // Don't overwrite current attributes
            node.data.hProperties = {
              emote: true,
              ...node.data.hProperties,
            };
          }
        }
      }
    });
  }

  return transformer;
};

// ****************************************************************************
// ****************************************************************************

const SimpleLink = (props: SimpleLinkProps) => {
  const { title, children, href, embed } = props;

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
  const embedParam = urlParams.get('embed');

  if (embed || embedParam) {
    // Decode this since users might just copy it from the url bar
    const decodedUri = decodeURI(uri);
    return (
      <div className="embed__inline-button embed__inline-button--preview">
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

  if (isEmote(title, src)) {
    return <OptimizedImage src={src} title={title} className="emote" waitLoad loading="lazy" />;
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

const REPLACE_REGEX = /(?:<iframe\s+src=["'])(.*?(?=))(?:["']\s*><\/iframe>)/g;

// ****************************************************************************
// ****************************************************************************

export default React.memo<MarkdownProps>(function MarkdownPreview(props: MarkdownProps) {
  const {
    // content,
    strip,
    simpleLinks,
    noDataStore,
    className,
    parentCommentId,
    isMarkdownPost,
    disableTimestamps,
    stakedLevel,
    setUserMention,
    hasMembership,
    isComment,
    isMinimal,
  } = props;
  let { content } = props;

  const strippedContent = content
    ? content.replace(REPLACE_REGEX, (iframeHtml, iframeUrl) => {
        if (platform.isSafari()) {
          return iframeUrl;
        }

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
              simpleLinks={simpleLinks}
              allowPreview={(isStakeEnoughForPreview(stakedLevel) || hasMembership) && !isMinimal}
              setUserMention={setUserMention}
              isComment={isComment}
            />
          ),
      // Workaraund of remarkOptions.Fragment
      div: React.Fragment,
      img: (imgProps) => {
        const isGif = imgProps.src && imgProps.src.endsWith('gif');

        const imageCdnUrl =
          (isGif
            ? getImageProxyUrl(imgProps.src)
            : getThumbnailCdnUrl({ thumbnail: imgProps.src, width: 0, height: 0, quality: 85 })) ||
          MISSING_THUMB_DEFAULT;
        if (noDataStore) {
          return (
            <div className="file-viewer file-viewer--document">
              <img {...imgProps} src={imageCdnUrl} />
            </div>
          );
        } else if ((isStakeEnoughForPreview(stakedLevel) || hasMembership) && !isEmote(imgProps.title, imgProps.src)) {
          return <ZoomableImage {...imgProps} src={imageCdnUrl} />;
        } else {
          return (
            <SimpleImageLink
              src={imageCdnUrl}
              alt={imgProps.alt}
              title={imgProps.title}
              helpText={__('Odysee Premium required to enable image previews')}
            />
          );
        }
      },
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
    <div dir="auto" className={classnames('notranslate markdown-preview', className)}>
      {
        remark()
          .use(remarkAttr, remarkAttrOpts)
          // Remark plugins for lbry urls
          // Note: The order is important
          .use(formattedLinks)
          .use(inlineLinks)
          .use(disableTimestamps || isMarkdownPost ? null : inlineTimestamp)
          .use(disableTimestamps || isMarkdownPost ? null : formattedTimestamp)
          // Emojis
          .use(remarkTwemoji)
          .use(inlineEmote)
          .use(formattedEmote) // :code:
          .use(remarkEmoji)
          // Render new lines without needing spaces.
          .use(remarkBreaks)
          .use(remarkFrontMatter, ['yaml'])
          .use(reactRenderer, remarkOptions)
          .processSync(strippedContent).contents
      }
    </div>
  );
});
