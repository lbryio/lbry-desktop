import DateTime from 'component/dateTime';

export function formatClaimPreviewTitle(title, channelTitle, date, mediaDuration) {
  // Aria-label value for claim preview
  let ariaDate = date ? DateTime.getTimeAgoStr(date) : null;
  let ariaLabelData = title;

  if (mediaDuration) {
    if (ariaDate) {
      ariaLabelData += ariaLabelData = __('%title% by %channelTitle% %ariaDate%, %mediaDuration%', {
        title,
        channelTitle,
        ariaDate,
        mediaDuration,
      });
    } else {
      ariaLabelData += ariaLabelData = __('%title% by %channelTitle%, %mediaDuration%', {
        title,
        channelTitle,
        mediaDuration,
      });
    }
  } else {
    if (ariaDate) {
      ariaLabelData += ariaLabelData = __('%title% by %channelTitle% %ariaDate%', { title, channelTitle, ariaDate });
    } else {
      ariaLabelData += ariaLabelData = __('%title% by %channelTitle%', { title, channelTitle });
    }
  }

  return ariaLabelData;
}
