// @flow
import { SORT_COMMENTS_NEW, SORT_COMMENTS_BEST, SORT_COMMENTS_CONTROVERSIAL } from 'constants/comment';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';
import * as REACTION_TYPES from 'constants/reactions';

const ALL_VALID_STICKERS = [...FREE_GLOBAL_STICKERS, ...PAID_GLOBAL_STICKERS];
const stickerRegex = /(<stkr>:[A-Z0-9_]+:<stkr>)/;

// Mostly taken from Reddit's sorting functions
// https://github.com/reddit-archive/reddit/blob/master/r2/r2/lib/db/_sorts.pyx

type SortProps = {
  comments: ?Array<Comment>,
  reactionsById: {},
  sort: string,
  isMyComment: (string) => boolean,
};

export function sortComments(sortProps: SortProps): Array<Comment> {
  const { comments, reactionsById, sort, isMyComment } = sortProps;

  if (!comments) return [];

  return comments.slice().sort((a: Comment, b: Comment) => {
    if (a.is_pinned) {
      return -1;
    } else if (b.is_pinned) {
      return 1;
    }

    if (sort === SORT_COMMENTS_NEW) return 0;

    const aIsMine = isMyComment(a.channel_id);
    const bIsMine = isMyComment(b.channel_id);

    if (aIsMine) {
      return -1;
    } else if (bIsMine) {
      return 1;
    }

    const aReactions = reactionsById[a.comment_id];
    const bReactions = reactionsById[b.comment_id];
    const aLikes = (aReactions && aReactions[REACTION_TYPES.LIKE]) || 0;
    const aDislikes = (aReactions && aReactions[REACTION_TYPES.DISLIKE]) || 0;
    const bLikes = (bReactions && bReactions[REACTION_TYPES.LIKE]) || 0;
    const bDislikes = (bReactions && bReactions[REACTION_TYPES.DISLIKE]) || 0;

    if (sort === SORT_COMMENTS_CONTROVERSIAL) {
      if (aLikes === 0 && aDislikes === 0) {
        return 1;
      } else if (bLikes === 0 && bDislikes === 0) {
        return -1;
      }

      const aMagnitude = aLikes + aDislikes;
      const bMagnitude = bLikes + bDislikes;

      const aBalance = aLikes > aDislikes ? aDislikes / aLikes : aLikes / aDislikes;
      const bBalance = bLikes > bDislikes ? bDislikes / bLikes : bLikes / bDislikes;

      return bMagnitude ** bBalance - aMagnitude ** aBalance;
    }

    if (sort === SORT_COMMENTS_BEST) {
      const aN = aLikes + aDislikes;
      const bN = bLikes + bDislikes;

      if (aLikes === 0 && bLikes === 0 && (aDislikes || bDislikes)) {
        return aDislikes - bDislikes;
      } else if (aLikes === 0 && bLikes > 0) {
        return 1;
      } else if (bLikes === 0 && aLikes > 1) {
        return -1;
      }

      const z = 1.281551565545; // 80% confidence
      const aP = aLikes / aN;
      const bP = bLikes / bN;

      const aLeft = aP + (1 / (2 * aN)) * z * z;
      const aRight = z * Math.sqrt((aP * (1 - aP)) / aN + (z * z) / (4 * aN * aN));
      const aUnder = 1 + (1 / aN) * z * z;

      const bLeft = bP + (1 / (2 * bN)) * z * z;
      const bRight = z * Math.sqrt((bP * (1 - bP)) / bN + (z * z) / (4 * bN * bN));
      const bUnder = 1 + (1 / bN) * z * z;

      return (bLeft - bRight) / bUnder - (aLeft - aRight) / aUnder;
    }

    return 0;
  });
}

export const buildValidSticker = (sticker: string) => `<stkr>${sticker}<stkr>`;

export function parseSticker(comment: string) {
  const matchSticker = comment.match(stickerRegex);
  const stickerValue = matchSticker && matchSticker[0];
  const stickerName = stickerValue && stickerValue.replace(/<stkr>/g, '');
  const commentIsSticker = stickerValue && stickerValue.length === comment.length;

  return commentIsSticker && ALL_VALID_STICKERS.find(({ name }) => name === stickerName);
}

export function getStickerUrl(comment: string) {
  const stickerFromComment = parseSticker(comment);
  return stickerFromComment && stickerFromComment.url;
}

export function getCommentsListTitle(totalComments: number) {
  const title =
    (totalComments === 0 && __('Leave a comment')) ||
    (totalComments === 1 && __('1 comment')) ||
    __('%total_comments% comments', { total_comments: totalComments });

  return title;
}
