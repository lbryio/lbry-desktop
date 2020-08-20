// @flow
// A housing for all of our icons. Mostly taken from https://github.com/feathericons/react-feather
import * as ICONS from 'constants/icons';
import React, { forwardRef } from 'react';

type IconProps = {
  size: number,
  color: string,
};

// Returns a react component
// Icons with tooltips need to use this function so the ref can be properly forwarded
const buildIcon = (iconStrokes: React$Node, customSvgValues = {}) =>
  forwardRef((props: IconProps, ref) => {
    const { size = 24, color = 'currentColor', ...otherProps } = props;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...otherProps}
        {...customSvgValues}
      >
        {iconStrokes}
      </svg>
    );
  });

export const icons = {
  // The LBRY icon is different from the base icon set so don't use buildIcon()
  [ICONS.LBRY]: () => (
    <svg stroke="currentColor" fill="currentColor" x="0px" y="0px" viewBox="0 0 322 254" className="icon lbry-icon">
      <path d="M296,85.9V100l-138.8,85.3L52.6,134l0.2-7.9l104,51.2L289,96.1v-5.8L164.2,30.1L25,116.2v38.5l131.8,65.2 l137.6-84.4l3.9,6l-141.1,86.4L18.1,159.1v-46.8l145.8-90.2C163.9,22.1,296,85.9,296,85.9z" />
      <path d="M294.3,150.9l2-12.6l-12.2-2.1l0.8-4.9l17.1,2.9l-2.8,17.5L294.3,150.9L294.3,150.9z" />
    </svg>
  ),
  [ICONS.REWARDS]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </g>
  ),
  [ICONS.ARROW_LEFT]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </g>
  ),
  [ICONS.ARROW_RIGHT]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </g>
  ),
  [ICONS.HOME]: buildIcon(
    <g strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1, 11 L12, 2 C12, 2 22.9999989, 11.0000005 23, 11" />
      <path d="M3, 10 C3, 10 3, 10.4453982 3, 10.9968336 L3, 20.0170446 C3, 20.5675806 3.43788135, 21.0138782 4.00292933, 21.0138781 L8.99707067, 21.0138779 C9.55097324, 21.0138779 10, 20.5751284 10, 20.0089602 L10, 15.0049177 C10, 14.449917 10.4433532, 14 11.0093689, 14 L12.9906311, 14 C13.5480902, 14 14, 14.4387495 14, 15.0049177 L14, 20.0089602 C14, 20.5639609 14.4378817, 21.0138779 15.0029302, 21.0138779 L19.9970758, 21.0138781 C20.5509789, 21.0138782 21.000006, 20.56848 21.000006, 20.0170446 L21.0000057, 10" />
    </g>
  ),
  [ICONS.PUBLISH]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <path
        d="M8, 18 L5, 18 L5, 18 C2.790861, 18 1, 16.209139 1, 14 C1, 11.790861 2.790861, 10 5, 10 C5.35840468, 10 5.70579988, 10.0471371 6.03632437, 10.1355501 C6.01233106, 9.92702603 6, 9.71495305 6, 9.5 C6, 6.46243388 8.46243388, 4 11.5, 4 C14.0673313, 4 16.2238156, 5.7590449 16.8299648, 8.1376465 C17.2052921, 8.04765874 17.5970804, 8 18, 8 C20.7614237, 8 23, 10.2385763 23, 13 C23, 15.7614237 20.7614237, 18 18, 18 L16, 18"
        strokeLinejoin="round"
      />
      <path d="M12, 13 L12, 21" />
      <polyline
        strokeLinejoin="round"
        transform="translate(12.000000, 12.500000) scale(1, -1) translate(-12.000000, -12.500000)"
        points="15 11 12 14 9 11"
      />
    </g>
  ),
  [ICONS.SUBSCRIBE]: buildIcon(
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  [ICONS.UNSUBSCRIBE]: buildIcon(
    <path d="M 12,5.67 10.94,4.61 C 5.7533356,-0.57666427 -2.0266644,7.2033357 3.16,12.39 l 1.06,1.06 7.78,7.78 7.78,-7.78 1.06,-1.06 c 2.149101,-2.148092 2.149101,-5.6319078 0,-7.78 -2.148092,-2.1491008 -5.631908,-2.1491008 -7.78,0 L 9.4481298,8.2303201 15.320603,9.2419066 11.772427,13.723825" />
  ),
  [ICONS.SETTINGS]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </g>
  ),
  [ICONS.ACCOUNT]: buildIcon(
    <g>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </g>
  ),
  [ICONS.OVERVIEW]: buildIcon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  [ICONS.WALLET]: buildIcon(
    <g>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </g>
  ),
  [ICONS.LIBRARY]: buildIcon(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />),
  [ICONS.EDIT]: buildIcon(
    <g>
      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
    </g>
  ),
  [ICONS.DOWNLOAD]: buildIcon(
    <g>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </g>
  ),
  [ICONS.HELP]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </g>
  ),
  [ICONS.BLOCK]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </g>
  ),
  [ICONS.UNBLOCK]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
    </g>
  ),
  [ICONS.LIGHT]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  ),
  [ICONS.DARK]: buildIcon(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />),
  [ICONS.FEEDBACK]: buildIcon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
  [ICONS.SEARCH]: buildIcon(
    <g>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </g>
  ),
  [ICONS.SHARE]: buildIcon(
    <g>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </g>
  ),
  [ICONS.REPORT]: buildIcon(
    <g>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </g>
  ),
  [ICONS.EXTERNAL]: buildIcon(
    <g>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </g>
  ),
  [ICONS.DELETE]: buildIcon(
    <g>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </g>
  ),
  [ICONS.COPY]: buildIcon(
    <g>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </g>
  ),
  [ICONS.REMOVE]: buildIcon(
    <g>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </g>
  ),
  [ICONS.ADD]: buildIcon(
    <g>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  ),
  [ICONS.SUBTRACT]: buildIcon(
    <g>
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  ),
  [ICONS.CHAT]: buildIcon(
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  [ICONS.YES]: buildIcon(
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  ),
  [ICONS.NO]: buildIcon(
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  ),
  [ICONS.UP]: buildIcon(<polyline transform="matrix(1,0,0,-1,0,24.707107)" points="6 9 12 15 18 9" />),
  [ICONS.DOWN]: buildIcon(<polyline points="6 9 12 15 18 9" />),
  [ICONS.FULLSCREEN]: buildIcon(
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  ),
  [ICONS.FILE]: buildIcon(
    <g>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </g>
  ),
  [ICONS.CHANNEL]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </g>
  ),
  [ICONS.WEB]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </g>
  ),
  [ICONS.ALERT]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12" y2="16" />
    </g>
  ),
  [ICONS.UNLOCK]: buildIcon(
    <g>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </g>
  ),

  [ICONS.LOCK]: buildIcon(
    <g>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </g>
  ),

  [ICONS.TAG]: buildIcon(
    <g>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7" y2="7" />
    </g>
  ),
  [ICONS.SUPPORT]: buildIcon(
    <g>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </g>
  ),
  [ICONS.EYE]: buildIcon(
    <g>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  [ICONS.EYE_OFF]: buildIcon(
    <g>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </g>
  ),
  [ICONS.VIEW]: buildIcon(
    <g>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </g>
  ),
  [ICONS.SIGN_IN]: buildIcon(
    <g>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </g>
  ),
  [ICONS.SIGN_UP]: buildIcon(
    <g>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </g>
  ),
  [ICONS.SIGN_OUT]: buildIcon(
    <g>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </g>
  ),
  [ICONS.PHONE]: buildIcon(
    <g>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </g>
  ),
  [ICONS.MENU]: buildIcon(
    <g>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </g>
  ),
  [ICONS.DISCOVER]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </g>
  ),
  [ICONS.TRENDING]: buildIcon(
    <g>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </g>
  ),
  [ICONS.TOP]: buildIcon(
    <g>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </g>
  ),
  [ICONS.NEW]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 13.5 13.5" />
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />{' '}
    </g>
  ),
  [ICONS.INVITE]: buildIcon(
    <g>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  ),
  [ICONS.VIDEO]: buildIcon(
    <g>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </g>
  ),
  [ICONS.AUDIO]: buildIcon(
    <g>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </g>
  ),
  [ICONS.VOLUME_MUTED]: buildIcon(
    <g>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </g>
  ),
  [ICONS.IMAGE]: buildIcon(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </g>
  ),
  [ICONS.TEXT]: buildIcon(
    <g>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </g>
  ),
  [ICONS.DOWNLOADABLE]: buildIcon(
    <g>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </g>
  ),
  [ICONS.REPOST]: buildIcon(
    <g>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </g>
  ),
  [ICONS.MORE_VERTICAL]: buildIcon(
    <g>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </g>
  ),
  [ICONS.VALIDATED]: buildIcon(
    <g>
      <polyline points="20 6 9 17 4 12" />
    </g>
  ),
  [ICONS.SLIDERS]: buildIcon(
    <g>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </g>
  ),
  [ICONS.ANALYTICS]: buildIcon(
    <g>
      <path d="M 8.4312337,1.6285136 V 9.4232264 L 2.2367584,22.725564 H 22.030217 L 15.773797,9.2902071 V 1.6285136 Z" />
      <path d="M 4.2426407,18.166369 H 12.197591" />
      <path d="m 6.363961,14.188893 h 5.701048" />
    </g>
  ),

  //
  // Share modal social icons
  //
  [ICONS.TWITTER]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#55ACEE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.1015 24.3844L29.1645 25.4224L28.1152 25.2953C24.2961 24.8081 20.9596 23.1556 18.1267 20.3804L16.7417 19.0034L16.385 20.0203C15.6295 22.2871 16.1122 24.681 17.686 26.291C18.5254 27.1808 18.3365 27.3079 16.8886 26.7783C16.385 26.6088 15.9443 26.4817 15.9023 26.5453C15.7554 26.6935 16.2591 28.6214 16.6578 29.384C17.2034 30.4433 18.3155 31.4814 19.5326 32.0957L20.5609 32.583L19.3438 32.6042C18.1686 32.6042 18.1267 32.6254 18.2526 33.0702C18.6723 34.4473 20.33 35.909 22.1767 36.5446L23.4777 36.9895L22.3445 37.6674C20.6658 38.6419 18.6933 39.1927 16.7207 39.2351C15.7764 39.2563 15 39.341 15 39.4046C15 39.6164 17.5601 40.8028 19.05 41.2689C23.5197 42.6459 28.8287 42.0527 32.8157 39.7012C35.6486 38.0275 38.4815 34.7015 39.8035 31.4814C40.517 29.7654 41.2305 26.63 41.2305 25.1259C41.2305 24.1513 41.2934 24.0242 42.4686 22.8591C43.161 22.1811 43.8116 21.4397 43.9375 21.2278C44.1473 20.8253 44.1263 20.8253 43.0561 21.1854C41.2724 21.821 41.0206 21.7362 41.902 20.7829C42.5525 20.105 43.3289 18.8763 43.3289 18.5161C43.3289 18.4526 43.0141 18.5585 42.6574 18.7492C42.2797 18.961 41.4403 19.2788 40.8108 19.4694L39.6776 19.8296L38.6494 19.1305C38.0828 18.7492 37.2854 18.3255 36.8657 18.1983C35.7955 17.9017 34.1587 17.9441 33.1935 18.2831C30.5704 19.2364 28.9126 21.6939 29.1015 24.3844Z"
        fill="white"
      />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.FACEBOOK]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#3B5998"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.1269 47.6393V31.3178H37.6324L38.2295 25.6933H33.1269L33.1346 22.8781C33.1346 21.4112 33.274 20.6251 35.381 20.6251H38.1976V15H33.6915C28.2789 15 26.3738 17.7285 26.3738 22.317V25.6939H23V31.3184H26.3738V47.6393H33.1269Z"
        fill="white"
      />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.REDDIT]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
        fill="#FF5700"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52 29.6094C52 26.8656 49.7581 24.6331 47.0017 24.6331C45.7411 24.6331 44.5908 25.1045 43.7108 25.8741C40.5791 23.8712 36.4389 22.5679 31.854 22.3398L34.2649 14.753L40.843 16.2952C40.9167 18.5053 42.7408 20.2824 44.9793 20.2824C47.2636 20.2824 49.1224 18.4323 49.1224 16.1575C49.1224 13.8827 47.2632 12.0326 44.9793 12.0326C43.3199 12.0326 41.8896 13.0109 41.228 14.4159L33.8364 12.6845C33.3468 12.5702 32.8494 12.8509 32.6994 13.3286L29.8452 22.3101C24.9638 22.4055 20.5352 23.718 17.2164 25.8084C16.3462 25.0768 15.2228 24.6331 13.9983 24.6331C11.2419 24.6336 9 26.8656 9 29.6094C9 31.3563 9.91082 32.8922 11.2819 33.7795C11.2121 34.2251 11.1744 34.6766 11.1744 35.1334C11.1744 42.2094 19.8037 47.9664 30.412 47.9664C41.0194 47.9664 49.6497 42.2094 49.6497 35.1334C49.6497 34.7097 49.6174 34.2908 49.5573 33.8763C51.0159 33.0084 52 31.4235 52 29.6094ZM44.9792 13.9503C46.2022 13.9503 47.1971 14.9413 47.1971 16.159C47.1971 17.3766 46.2022 18.3671 44.9792 18.3671C43.7556 18.3671 42.7607 17.3766 42.7607 16.159C42.7607 14.9413 43.7556 13.9503 44.9792 13.9503ZM10.9253 29.6094C10.9253 27.9228 12.3037 26.5499 13.9978 26.5499C14.57 26.5499 15.1046 26.71 15.5644 26.9829C13.8498 28.3699 12.5666 30.002 11.843 31.786C11.2766 31.2309 10.9253 30.4608 10.9253 29.6094ZM47.7244 35.1344C47.7244 41.1527 39.957 46.0502 30.412 46.0502C20.8655 46.0502 13.0996 41.1532 13.0996 35.1344C13.0996 34.9223 13.1113 34.7131 13.1299 34.5044C13.1881 33.8647 13.3366 33.2391 13.5628 32.6329C14.1497 31.0615 15.2755 29.6196 16.8132 28.3902C17.3053 27.9967 17.8384 27.625 18.4091 27.2781C21.5242 25.3852 25.7548 24.2177 30.412 24.2177C35.1366 24.2177 39.4244 25.4183 42.5497 27.3599C43.1219 27.7145 43.6536 28.0949 44.1432 28.4973C45.6198 29.7081 46.6992 31.1199 47.2685 32.6548C47.4928 33.2629 47.6413 33.889 47.697 34.5302C47.7141 34.7311 47.7244 34.9315 47.7244 35.1344ZM49.03 31.9003C48.3269 30.0979 47.0467 28.4492 45.333 27.0447C45.8138 26.7328 46.3865 26.5499 47.0022 26.5499C48.6968 26.5499 50.0752 27.9223 50.0752 29.6094C50.0742 30.5216 49.6687 31.3399 49.03 31.9003Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.0214 32.827C27.0214 31.2109 25.705 29.855 24.0813 29.855C22.458 29.855 21.0967 31.2109 21.0967 32.827C21.0967 34.4426 22.4585 35.7547 24.0813 35.7547C25.705 35.7527 27.0214 34.4426 27.0214 32.827Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.9632 29.8541C35.34 29.8541 33.9742 31.2094 33.9742 32.8255C33.9742 34.4421 35.34 35.7532 36.9632 35.7532C38.5869 35.7532 39.9043 34.4431 39.9043 32.8255C39.9033 31.2084 38.5869 29.8541 36.9632 29.8541Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.1325 39.9224C35.0434 41.0053 33.2095 41.5312 30.5225 41.5312C30.5142 41.5312 30.5068 41.5336 30.499 41.5336C30.4907 41.5336 30.4839 41.5312 30.4761 41.5312C27.7886 41.5312 25.9542 41.0053 24.8665 39.9224C24.4908 39.5478 23.8809 39.5478 23.5052 39.9224C23.1289 40.2974 23.1289 40.9041 23.5052 41.2772C24.9716 42.7377 27.252 43.4484 30.4761 43.4484C30.4844 43.4484 30.4912 43.4455 30.499 43.4455C30.5068 43.4455 30.5142 43.4484 30.5225 43.4484C33.746 43.4484 36.027 42.7377 37.4948 41.2782C37.8716 40.9031 37.8716 40.297 37.4958 39.9233C37.1191 39.5487 36.5093 39.5487 36.1325 39.9224Z"
        fill="white"
      />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.TELEGRAM]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
        fill="url(#paint0_linear)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.5 43.75C23.5281 43.75 23.6933 43.383 23.3581 42.4576L20.5 33.0515L42.5 20"
        fill="#C8DAEA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.5 43.75C25.25 43.75 25.5814 43.407 26 43L30 39.1105L25.0105 36.1017"
        fill="#A9C9DD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.01 36.1025L37.1 45.0347C38.4796 45.796 39.4753 45.4018 39.819 43.7539L44.7402 20.5631C45.2441 18.5431 43.9702 17.6269 42.6504 18.2261L13.7529 29.3688C11.7804 30.16 11.7919 31.2605 13.3933 31.7508L20.8091 34.0654L37.9773 23.2341C38.7878 22.7427 39.5317 23.0069 38.9211 23.5487"
        fill="url(#paint1_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="22.503" y1="2.502" x2="7.503" y2="37.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37AEE2" />
          <stop offset="1" stopColor="#1E96C8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="26.2445"
          y1="31.8428"
          x2="29.4499"
          y2="42.2115"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EFF7FC" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.LINKEDIN]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#0077B5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6484 18.5283C21.6042 16.5255 20.1721 15 17.8462 15C15.5205 15 14 16.5255 14 18.5283C14 20.4897 15.4756 22.0592 17.7581 22.0592H17.8015C20.1721 22.0592 21.6484 20.4897 21.6484 18.5283ZM21.2007 24.8473H14.4021V45.2744H21.2007V24.8473ZM37.8914 24.3677C42.3652 24.3677 45.7192 27.2878 45.7192 33.5621L45.719 45.2745H38.9207V34.3459C38.9207 31.601 37.9368 29.7278 35.4756 29.7278C33.5974 29.7278 32.4785 30.9906 31.9873 32.2102C31.8074 32.6473 31.7634 33.2563 31.7634 33.8668V45.275H24.9639C24.9639 45.275 25.0535 26.7646 24.9639 24.8479H31.7634V27.7412C32.6658 26.3503 34.2817 24.3677 37.8914 24.3677Z"
        fill="white"
      />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.EMBED]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#eee"
      />
      <g transform="scale(1.2)">
        <polyline points="15 18 9 12 15 6" stroke="black" transform="translate(6,12)" strokeWidth="2" />
        <polyline points="9 18 15 12 9 6" stroke="black" transform="translate(20,12)" strokeWidth="2" />
      </g>
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.MORE]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#eee"
      />
      <circle cx="20" cy="30" r="2" stroke="black" fill="black" />
      <circle cx="30" cy="30" r="2" stroke="black" fill="black" />
      <circle cx="40" cy="30" r="2" stroke="black" fill="black" />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.SHARE_LINK]: buildIcon(
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
        fill="#eee"
      />
      <path d="M28 30a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="black" />
      <path d="M32 27a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="black" />
    </g>,
    {
      viewBox: '0 0 60 60',
    }
  ),
  [ICONS.PURCHASED]: buildIcon(
    <g>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </g>
  ),
  [ICONS.COMPLETED]: buildIcon(
    <g>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </g>
  ),
  [ICONS.PINNED]: buildIcon(
    <g>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </g>
  ),
  [ICONS.REFRESH]: buildIcon(
    <g>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </g>
  ),
  [ICONS.BUY]: buildIcon(
    <g>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </g>
  ),
  [ICONS.SEND]: buildIcon(
    <g>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </g>
  ),
  [ICONS.RECEIVE]: buildIcon(
    <g>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </g>
  ),
  [ICONS.OPEN_LOG_FOLDER]: buildIcon(
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  [ICONS.OPEN_LOG]: buildIcon(
    <g>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </g>
  ),
  [ICONS.CAMERA]: buildIcon(
    <g>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </g>
  ),
  [ICONS.LBRY_STATUS]: buildIcon(
    <g>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </g>
  ),
  [ICONS.NOTIFICATION]: buildIcon(
    <g>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </g>
  ),
  [ICONS.POST]: buildIcon(
    <g>
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </g>
  ),
  [ICONS.REPLY]: buildIcon(
    <g>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </g>
  ),
};
