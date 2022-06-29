// @flow
import { platform } from 'util/platform';

const REQUIRED_DELAY_FOR_IOS_MS = 10;
const MIN_SECONDS_BETWEEN_CHAPTERS = 10;
const MIN_CHAPTERS = 3;

type TimestampData = Array<{ seconds: number, label: string }>;

function isValidTimestamp(str: string) {
  let isValidTimestamp;
  switch (str.length) {
    case 4: // "9:59"
      isValidTimestamp = /^[0-9]:[0-5][0-9]$/.test(str);
      break;
    case 5: // "59:59"
      isValidTimestamp = /^[0-5][0-9]:[0-5][0-9]$/.test(str);
      break;
    case 7: // "9:59:59"
      isValidTimestamp = /^[0-9]:[0-5][0-9]:[0-5][0-9]$/.test(str);
      break;
    case 8: // "99:59:59"
      isValidTimestamp = /^[0-9][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(str);
      break;
    default:
      // Reject
      isValidTimestamp = false;
      break;
  }
  return isValidTimestamp;
}

function timestampStrToSeconds(ts: string) {
  const parts = ts.split(':').reverse();
  let seconds = 0;

  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    const parsed = parseInt(part);
    if (!isNaN(parsed)) {
      seconds += parsed * Math.pow(60, i);
    }
  }

  return seconds;
}

function parse(claim: StreamClaim) {
  // - Must have at least 3 timestamps.
  // - First one must be 0:00.
  // - Chapters must be at least 10 seconds apart.
  // - Format: one per line, "0:00 Blah..."

  const description = claim?.value?.description;
  if (!description) {
    return null;
  }

  const lines = description.split('\n');
  const timestamps = [];

  lines.forEach((line) => {
    if (line.length > 0) {
      const splitIndex = line.indexOf(' ');
      if (splitIndex >= 0 && splitIndex < line.length - 2) {
        const ts = line.substring(0, splitIndex);
        const label = line.substring(splitIndex + 1);

        if (ts && label && isValidTimestamp(ts)) {
          const seconds = timestampStrToSeconds(ts);

          if (timestamps.length !== 0) {
            const prevSeconds = timestamps[timestamps.length - 1].seconds;
            if (seconds - prevSeconds < MIN_SECONDS_BETWEEN_CHAPTERS) {
              return null;
            }
          } else {
            if (seconds !== 0) {
              return null;
            }
          }

          timestamps.push({ seconds, label });
        }
      }
    }
  });

  return timestamps.length >= MIN_CHAPTERS ? timestamps : null;
}

function overrideHoverTooltip(player: any, tsData: TimestampData, duration: number) {
  try {
    const timeTooltip = player
      .getChild('controlBar')
      .getChild('progressControl')
      .getChild('seekBar')
      .getChild('mouseTimeDisplay')
      .getChild('timeTooltip');

    // sometimes old 'right' rule is persisted and messes up styling
    timeTooltip.el().style.removeProperty('right');

    timeTooltip.update = function (seekBarRect, seekBarPoint, time) {
      const values = Object.values(tsData);
      // $FlowIssue: mixed
      const seconds = values.map((v) => v.seconds);
      const curSeconds = timestampStrToSeconds(time);
      let i = 0;

      for (; i < seconds.length; ++i) {
        const s0 = seconds[i];
        const s1 = i === seconds.length - 1 ? duration : seconds[i + 1];
        if (curSeconds >= s0 && curSeconds < s1) {
          break;
        }
      }

      if (i < seconds.length) {
        // $FlowIssue: mixed
        this.write(`${time} - ${values[i].label}`);
      } else {
        console.error('Chapters: oob ' + player?.claim?.name);
        this.write(time);
      }
    };
  } catch {}
}

function load(player: any, timestampData: TimestampData, duration: number) {
  player.one('loadedmetadata', () => {
    const textTrack = player.addTextTrack('chapters', __('Chapters'), 'en');

    setTimeout(() => {
      const values = Object.values(timestampData);
      values.forEach((ts, index) => {
        // $FlowIssue: mixed
        const start = ts.seconds;
        // $FlowIssue: mixed
        const end = index === values.length - 1 ? duration : values[index + 1].seconds;
        // $FlowIssue: mixed
        textTrack.addCue(new window.VTTCue(start, end, ts.label));
      });

      addMarkersOnProgressBar(
        // $FlowIssue: mixed
        values.map((v) => v.seconds),
        duration
      );

      const chaptersButton = player?.controlBar?.chaptersButton;
      if (chaptersButton) {
        chaptersButton.update();
      }
    }, REQUIRED_DELAY_FOR_IOS_MS);
  });
}

function deleteHoverInformation(player) {
  try {
    const timeTooltip = player
      .getChild('controlBar')
      .getChild('progressControl')
      .getChild('seekBar')
      .getChild('mouseTimeDisplay')
      .getChild('timeTooltip');

    delete timeTooltip.update;
  } catch {}
}

export function parseAndLoad(player: any, claim: StreamClaim) {
  console.assert(claim, 'null claim');

  if (platform.isMobile()) {
    return;
  }

  const tsData = parse(claim);
  const duration = claim?.value?.video?.duration || claim?.value?.audio?.duration;

  if (tsData && duration) {
    load(player, tsData, duration);
    overrideHoverTooltip(player, tsData, duration);
  } else {
    deleteHoverInformation(player);
    // $FlowIssue
    player?.controlBar?.getChild('ChaptersButton')?.hide();
  }
}

function addMarkersOnProgressBar(chapterStartTimes: Array<number>, videoDuration: number) {
  const progressControl = document.getElementsByClassName('vjs-progress-holder vjs-slider vjs-slider-horizontal')[0];
  if (!progressControl) {
    console.error('Failed to find progress-control');
    return;
  }

  for (let i = 0; i < chapterStartTimes.length; ++i) {
    const elem = document.createElement('div');
    // $FlowIssue
    elem['className'] = 'vjs-chapter-marker';
    // $FlowIssue
    elem['id'] = 'chapter' + i;
    elem.style.left = `${(chapterStartTimes[i] / videoDuration) * 100}%`;
    progressControl.appendChild(elem);
  }
}
