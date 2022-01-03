import { getTimeAgoStr } from 'util/time';

export function formatClaimPreviewTitle(title, channelTitle, date, mediaDuration) {
  // Aria-label value for claim preview
  let ariaDate = date ? getTimeAgoStr(date, true) : null;
  let ariaLabelData = title;

  if (mediaDuration) {
    if (ariaDate) {
      ariaLabelData = __('%title% by %channelTitle% %ariaDate%, %mediaDuration%', {
        title,
        channelTitle,
        ariaDate,
        mediaDuration,
      });
    } else {
      ariaLabelData = __('%title% by %channelTitle%, %mediaDuration%', {
        title,
        channelTitle,
        mediaDuration,
      });
    }
  } else {
    if (ariaDate) {
      ariaLabelData = __('%title% by %channelTitle% %ariaDate%', { title, channelTitle, ariaDate });
    } else {
      ariaLabelData = __('%title% by %channelTitle%', { title, channelTitle });
    }
  }

  return ariaLabelData;
}
