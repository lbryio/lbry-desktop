//@ts-nocheck
import DateTime from "component/dateTime";

export function formatClaimPreviewTitle(title: unknown, channelTitle: unknown, date: unknown, mediaDuration: unknown) {
  // Aria-label value for claim preview
  const ariaDate = date ? DateTime.getTimeAgoStr(date) : null;
  let ariaLabelData = title;

  if (mediaDuration) {
    if (ariaDate) {
      ariaLabelData = __("%title% by %channelTitle% %ariaDate%, %mediaDuration%", {
        title,
        channelTitle,
        ariaDate,
        mediaDuration,
      });
    } else {
      ariaLabelData = __("%title% by %channelTitle%, %mediaDuration%", {
        title,
        channelTitle,
        mediaDuration,
      });
    }
  } else {
    if (ariaDate) {
      ariaLabelData = __("%title% by %channelTitle% %ariaDate%", { title, channelTitle, ariaDate });
    } else {
      ariaLabelData = __("%title% by %channelTitle%", { title, channelTitle });
    }
  }

  return ariaLabelData;
}
