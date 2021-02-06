// @flow
// A housing for all of our icons. Mostly taken from https://github.com/feathericons/react-feather
import * as ICONS from 'constants/icons';
import React, { forwardRef } from 'react';
import { v4 as uuid } from 'uuid';

type IconProps = {
  size: number,
  color: string,
  title?: string,
};

type CustomProps = {
  size?: number,
  className?: string,
};

// Returns a react component
// Icons with tooltips need to use this function so the ref can be properly forwarded
const buildIcon = (iconStrokes: React$Node, customSvgValues = {}) =>
  forwardRef((props: IconProps, ref) => {
    const { size = 24, color = 'currentColor', title, ...otherProps } = props;
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
        {title && <title>{title}</title>}
      </svg>
    );
  });

export const icons = {
  // The LBRY icon is different from the base icon set so don't use buildIcon()
  [ICONS.LBRY]: (props: IconProps) => (
    <svg stroke="currentColor" fill="currentColor" x="0px" y="0px" viewBox="0 0 322 254" className="icon lbry-icon">
      <path d="M296,85.9V100l-138.8,85.3L52.6,134l0.2-7.9l104,51.2L289,96.1v-5.8L164.2,30.1L25,116.2v38.5l131.8,65.2 l137.6-84.4l3.9,6l-141.1,86.4L18.1,159.1v-46.8l145.8-90.2C163.9,22.1,296,85.9,296,85.9z" />
      <path d="M294.3,150.9l2-12.6l-12.2-2.1l0.8-4.9l17.1,2.9l-2.8,17.5L294.3,150.9L294.3,150.9z" />
    </svg>
  ),
  [ICONS.LBC]: (props: IconProps) => {
    const { size = 24, color = 'currentColor', ...rest } = props;
    const randomId = uuid();

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="0"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        <path d="M1.03125 14.1562V9.84375L12 0L22.9688 9.84375V14.1562L12 24L1.03125 14.1562Z" fill="black" />
        <path d="M8.925 10.3688L3.99375 14.8125L7.70625 18.15L12.6375 13.7063L8.925 10.3688Z" fill="black" />
        <path
          d="M8.925 10.3688L15.1312 4.80005L12 1.98755L2.60625 10.425V13.575L3.99375 14.8125L8.925 10.3688Z"
          fill="black"
        />
        <path
          d="M8.925 10.3688L3.99375 14.8125L7.70625 18.15L12.6375 13.7063L8.925 10.3688Z"
          fill={`url(#paint0_linear${randomId})`}
        />
        <path
          d="M8.925 10.3688L15.1312 4.80005L12 1.98755L2.60625 10.425V13.575L3.99375 14.8125L8.925 10.3688Z"
          fill={`url(#paint1_linear${randomId})`}
        />
        <path
          d="M15.075 13.6313L20.0062 9.1876L16.2937 5.8501L11.3625 10.2938L15.075 13.6313Z"
          fill={`url(#paint2_linear${randomId})`}
        />
        <path
          d="M15.075 13.6312L8.86875 19.2L12 22.0125L21.3937 13.575V10.425L20.0062 9.1875L15.075 13.6312Z"
          fill={`url(#paint3_linear${randomId})`}
        />

        <defs>
          <linearGradient
            id={`paint0_linear${randomId}`}
            x1="3.7206"
            y1="14.2649"
            x2="15.1645"
            y2="14.2649"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.2464" stopColor="#E700FF" />
            <stop offset="0.3166" stopColor="#E804F9" />
            <stop offset="0.4108" stopColor="#E90EE8" />
            <stop offset="0.5188" stopColor="#EC1FCC" />
            <stop offset="0.637" stopColor="#F037A5" />
            <stop offset="0.7635" stopColor="#F45672" />
            <stop offset="0.8949" stopColor="#FA7A36" />
            <stop offset="1" stopColor="#FF9B00" />
          </linearGradient>
          <linearGradient
            id={`paint1_linear${randomId}`}
            x1="2.60274"
            y1="8.40089"
            x2="15.14"
            y2="8.40089"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.4233" stopColor="#FABD09" />
            <stop offset="0.8292" stopColor="#FA6B00" />
          </linearGradient>
          <linearGradient
            id={`paint2_linear${randomId}`}
            x1="6.8682"
            y1="14.1738"
            x2="25.405"
            y2="4.84055"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BAFF8E" />
            <stop offset="0.6287" stopColor="#008EBB" />
          </linearGradient>
          <linearGradient
            id={`paint3_linear${randomId}`}
            x1="25.2522"
            y1="6.08799"
            x2="3.87697"
            y2="27.836"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BAFF8E" />
            <stop offset="0.6287" stopColor="#008EBB" />
          </linearGradient>
          <clipPath id="clip0">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  },
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
  [ICONS.FETCH]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <polyline points="8 17 12 21 16 17" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
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
  [ICONS.FILTER]: buildIcon(
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
  [ICONS.COIN_SWAP]: buildIcon(
    <g>
      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
  [ICONS.MUTE]: buildIcon(
    <g>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
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
  [ICONS.INFO]: buildIcon(
    <g>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" />
      <line x1="12" y1="12" x2="12" y2="16" />
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
  [ICONS.MORE]: buildIcon(
    <g transform="rotate(90 12 12)">
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
  [ICONS.NOT_COMPLETED]: buildIcon(<circle cx="12" cy="12" r="10" />),
  [ICONS.PINNED]: buildIcon(
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
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
  [ICONS.LAYOUT]: buildIcon(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </g>
  ),
  [ICONS.REPLY]: buildIcon(
    <g>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </g>
  ),
  [ICONS.YOUTUBE]: buildIcon(
    <g>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </g>
  ),
  [ICONS.SCIENCE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-3 0 24 24"
      width={props.size || '16'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.767018182,20.022 C0.300109091,20.6874545 0.243381818,21.558 0.618654545,22.2801818 C0.995018182,23.0012727 1.7412,23.454 2.55501818,23.454 L14.8997455,23.454 C15.7135636,23.454 16.4597455,23.0012727 16.8350182,22.2801818 C17.2113818,21.558 17.1535636,20.6874545 16.6877455,20.022 L11.4546545,11.454 L11.4546545,2.72672727 L6.00010909,2.72672727 L6.00010909,11.454 L0.767018182,20.022 L0.767018182,20.022 Z" />
      <path d="M13.6363636,1.63636364 C13.6363636,2.23963636 13.1487273,2.72727273 12.5454545,2.72727273 L4.90909091,2.72727273 C4.30581818,2.72727273 3.81818182,2.23963636 3.81818182,1.63636364 C3.81818182,1.03309091 4.30581818,0.545454545 4.90909091,0.545454545 L12.5454545,0.545454545 C13.1487273,0.545454545 13.6363636,1.03309091 13.6363636,1.63636364 L13.6363636,1.63636364 Z" />
      <line x1="11.4545455" y1="4.90909091" x2="9.27272727" y2="4.90909091" id="Stroke-8219" strokeLinecap="round" />
      <line x1="11.4545455" y1="9.27272727" x2="9.27272727" y2="9.27272727" id="Stroke-8220" strokeLinecap="round" />
      <line x1="11.4545455" y1="7.09090909" x2="8.18181818" y2="7.09090909" id="Stroke-8221" strokeLinecap="round" />
      <line x1="3.27272727" y1="15.8181818" x2="14.1818182" y2="15.8181818" id="Stroke-8222" />
      <path
        d="M13.0909091,21.2727273 C13.0909091,21.5738182 12.8465455,21.8181818 12.5454545,21.8181818 C12.2443636,21.8181818 12,21.5738182 12,21.2727273 C12,20.9716364 12.2443636,20.7272727 12.5454545,20.7272727 C12.8465455,20.7272727 13.0909091,20.9716364 13.0909091,21.2727273 L13.0909091,21.2727273 Z"
        id="Stroke-8223"
        strokeLinecap="round"
      />
      <path
        d="M10.3636364,18.2727273 C10.3636364,18.4232727 10.2414545,18.5454545 10.0909091,18.5454545 C9.94036364,18.5454545 9.81818182,18.4232727 9.81818182,18.2727273 C9.81818182,18.1221818 9.94036364,18 10.0909091,18 C10.2414545,18 10.3636364,18.1221818 10.3636364,18.2727273 L10.3636364,18.2727273 Z"
        id="Stroke-8224"
        strokeLinecap="round"
      />
      <path
        d="M7.63636364,19.6363636 C7.63636364,20.5396364 6.90327273,21.2727273 6,21.2727273 C5.09672727,21.2727273 4.36363636,20.5396364 4.36363636,19.6363636 C4.36363636,18.7330909 5.09672727,18 6,18 C6.90327273,18 7.63636364,18.7330909 7.63636364,19.6363636 L7.63636364,19.6363636 Z"
        id="Stroke-8225"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ICONS.TECH]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-5 0 24 24"
      width={props.size || '16'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M13.5005,21.5 C13.5005,22.604 12.6055,23.5 11.5005,23.5 L2.5005,23.5 C1.3955,23.5 0.5005,22.604 0.5005,21.5 L0.5005,2.5 C0.5005,1.396 1.3955,0.5 2.5005,0.5 L11.5005,0.5 C12.6055,0.5 13.5005,1.396 13.5005,2.5 L13.5005,21.5 L13.5005,21.5 Z"
        id="Stroke-5155"
        strokeLinecap="round"
      />
      <line x1="13.5005" y1="19.5" x2="0.5005" y2="19.5" id="Stroke-5156" strokeLinecap="round" />
      <line x1="13.5005" y1="4.5" x2="0.5005" y2="4.5" id="Stroke-5157" strokeLinecap="round" />
      <line x1="4.5005" y1="2.5" x2="9.5005" y2="2.5" id="Stroke-5158" strokeLinecap="round" />
      <path
        d="M7.0005,22 C6.7245,22 6.5005,21.776 6.5005,21.5 C6.5005,21.224 6.7245,21 7.0005,21 C7.2765,21 7.5005,21.224 7.5005,21.5 C7.5005,21.776 7.2765,22 7.0005,22 L7.0005,22 Z"
        id="Stroke-5159"
      />
    </svg>
  ),
  [ICONS.NEWS]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '16'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3.5" y1="3.5" x2="14.5" y2="3.5" id="Stroke-6102" />
      <polygon id="Stroke-6103" points="3.5 12.5 8.5 12.5 8.5 6.5 3.5 6.5" />
      <line x1="11.5" y1="8.5" x2="14.5" y2="8.5" id="Stroke-6104" />
      <line x1="10.5" y1="10.5" x2="14.5" y2="10.5" id="Stroke-6105" />
      <line x1="10.5" y1="12.5" x2="14.5" y2="12.5" id="Stroke-6106" />
      <line x1="3.5" y1="14.5" x2="14.5" y2="14.5" id="Stroke-6107" />
      <line x1="3.5" y1="16.5" x2="14.5" y2="16.5" id="Stroke-6108" />
      <line x1="3.5" y1="18.5" x2="14.5" y2="18.5" id="Stroke-6109" />
      <path
        d="M19.5,5.5 L21.5,5.5 L21.5,20.5 C21.5,21.052 21.053,21.5 20.5,21.5 C19.948,21.5 19.5,21.052 19.5,20.5 L19.5,2 L17.5,2 L17.5,4"
        id="Stroke-6110"
      />
      <path
        d="M20.5,23.5 L3.5,23.5 C1.844,23.5 0.5,22.157 0.5,20.5 L0.5,0.5 L17.5,0.5 L17.5,20.5 C17.5,22.157 18.844,23.5 20.5,23.5 C22.157,23.5 23.5,22.157 23.5,20.5 L23.5,3.5 L19.5,3.5"
        id="Stroke-6111"
      />
    </svg>
  ),
  [ICONS.FINANCE]: buildIcon(
    <g>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </g>
  ),
  [ICONS.RABBIT_HOLE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '16'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon id="Stroke-7926" points="0.5 22.5205 12 0.5205 23.5 22.5205" />
      <path
        d="M14,15.5205 C14,16.6245 13.104,17.5205 12,17.5205 C10.896,17.5205 10,16.6245 10,15.5205 C10,14.4155 10.896,13.5205 12,13.5205 C13.104,13.5205 14,14.4155 14,15.5205 L14,15.5205 Z"
        id="Stroke-7927"
      />
      <path
        d="M18.666,15.5205 C18.666,15.5205 16.666,19.5205 12,19.5205 C7.334,19.5205 5.334,15.5205 5.334,15.5205 C5.334,15.5205 7.334,11.5205 12,11.5205 C16.666,11.5205 18.666,15.5205 18.666,15.5205 L18.666,15.5205 Z"
        id="Stroke-7928"
      />
    </svg>
  ),
  [ICONS.ENLIGHTENMENT]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 0 24 24"
      width={props.size || '16'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M8.9258,14.3311 C2.4228,14.3311 3.0138,8.4191 3.0138,8.4191 C10.1078,8.4191 8.9258,14.3311 8.9258,14.3311 L8.9258,14.3311 Z"
        id="Stroke-5653"
      />
      <path
        d="M13.0732,14.3311 C19.5762,14.3311 18.9852,8.4191 18.9852,8.4191 C11.8912,8.4191 13.0732,14.3311 13.0732,14.3311 L13.0732,14.3311 Z"
        id="Stroke-5654"
      />
      <path
        d="M21.4995,10 C21.4995,16.352 13.9995,23 10.9995,23 C7.9995,23 0.4995,16.352 0.4995,10 C0.4995,3.648 4.6475,0.5 10.9995,0.5 C17.3505,0.5 21.4995,3.648 21.4995,10 L21.4995,10 Z"
        id="Stroke-5655"
      />
    </svg>
  ),
  [ICONS.GAMING]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -1 24 26"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <path
          d="M17.5,9 C17.5,4.307 13.694,0.5 9,0.5 C4.306,0.5 0.5,4.307 0.5,9 L0.5,22.5 C0.5,23.051 0.95,23.5 1.5,23.5 L2,23.5 C2.551,23.5 3,23.051 3,22.5 C3,21.951 3.45,21.5 4,21.5 C4.551,21.5 5,21.951 5,22.5 C5,23.051 5.45,23.5 6,23.5 L7,23.5 C7.551,23.5 8,23.051 8,22.5 C8,21.951 8.45,21.5 9,21.5 C9.551,21.5 10,21.951 10,22.5 C10,23.051 10.45,23.5 11,23.5 L12,23.5 C12.551,23.5 13,23.051 13,22.5 C13,21.951 13.45,21.5 14,21.5 C14.551,21.5 15,21.951 15,22.5 C15,23.051 15.45,23.5 16,23.5 L16.5,23.5 C17.051,23.5 17.5,23.051 17.5,22.5 L17.5,9 L17.5,9 Z"
          id="Stroke-939"
        />
        <path
          d="M13.5,12 C13.5,12.826 12.825,13.5 12,13.5 C11.176,13.5 10.5,12.826 10.5,12 L10.5,9 C10.5,8.176 11.176,7.5 12,7.5 C12.825,7.5 13.5,8.176 13.5,9 L13.5,12 L13.5,12 Z"
          id="Stroke-940"
        />
        <path
          d="M11.5,11 C11.5,11.277 11.276,11.5 11,11.5 C10.724,11.5 10.5,11.277 10.5,11 C10.5,10.725 10.724,10.5 11,10.5 C11.276,10.5 11.5,10.725 11.5,11 L11.5,11 Z"
          id="Stroke-941"
        />
        <path
          d="M7.5,12 C7.5,12.826 6.825,13.5 6,13.5 C5.176,13.5 4.5,12.826 4.5,12 L4.5,9 C4.5,8.176 5.176,7.5 6,7.5 C6.825,7.5 7.5,8.176 7.5,9 L7.5,12 L7.5,12 Z"
          id="Stroke-942"
        />
        <path
          d="M5.5,11 C5.5,11.277 5.276,11.5 5,11.5 C4.724,11.5 4.5,11.277 4.5,11 C4.5,10.725 4.724,10.5 5,10.5 C5.276,10.5 5.5,10.725 5.5,11 L5.5,11 Z"
          id="Stroke-943"
        />
      </g>
    </svg>
  ),
  [ICONS.COMMUNITY]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -1 24 26"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <path
          d="M0.5,5 L0.5,8 C0.5,12.694 3.806,16.5 8.5,16.5 C13.194,16.5 16.5,12.694 16.5,8 L16.5,5"
          id="Stroke-8485"
        />
        <path
          d="M12,0.5 C14.485,0.5 16.5,2.515 16.5,5 C16.5,7.485 14.485,9.5 12,9.5 L5,9.5 C2.515,9.5 0.5,7.485 0.5,5 C0.5,2.515 2.515,0.5 5,0.5 L12,0.5 L12,0.5 Z"
          id="Stroke-8486"
        />
        <path d="M5.1758,15.7891 C6.0938,12.1251 8.6878,10.1561 11.9998,9.5001" id="Stroke-8487" />
        <path d="M7.25,9.5 C5.316,9.5 3.75,7.934 3.75,6 C3.75,4.066 5.316,2.5 7.25,2.5 L10.5,2.5" id="Stroke-8488" />
        <path d="M10,0.5 C11.934,0.5 13.5,2.066 13.5,4 C13.5,5.934 11.934,7.5 10,7.5 L7,7.5" id="Stroke-8489" />
        <line x1="8.5" y1="16.5" x2="8.5" y2="23.5" id="Stroke-8490" />
        <line x1="8.5" y1="19.5" x2="11" y2="19.5" id="Stroke-8491" />
        <line x1="8.5" y1="22.5" x2="6" y2="22.5" id="Stroke-8492" />
        <path d="M9.5,5 C8.119,5 7,6.119 7,7.5" id="Stroke-8493" />
      </g>
    </svg>
  ),
  [ICONS.UPVOTE]: buildIcon(
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  ),
  [ICONS.DOWNVOTE]: buildIcon(
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  ),
  [ICONS.FIRE_ACTIVE]: buildIcon(
    <path
      d="M11.3969 23.04C11.3969 23.04 18.4903 21.8396 18.9753 16.2795C19.3997 9.89148 14.2161 7.86333 13.2915 4.56586C13.1861 4.2261 13.1051 3.88045 13.049 3.53109C12.9174 2.68094 12.8516 1.82342 12.852 0.964865C12.852 0.964865 5.607 0.426785 4.87947 10.6227C4.34858 10.1469 3.92655 9.57999 3.63777 8.9548C3.349 8.32962 3.19921 7.65853 3.19706 6.98033C3.19706 6.98033 -4.32074 18.7767 8.45649 23.04C7.94555 22.1623 7.67841 21.1842 7.67841 20.1909C7.67841 19.1976 7.94555 18.2195 8.45649 17.3418C9.54778 15.0653 9.97218 13.8788 9.97218 13.8788C9.97218 13.8788 15.5044 18.6525 11.3969 23.04Z"
      fill="#FF6635"
      strokeWidth="0"
    />
  ),
  [ICONS.SLIME_ACTIVE]: buildIcon(
    <path
      d="M13.065 4.18508C12.5638 4.47334 11.9699 4.5547 11.4096 4.41183C10.8494 4.26896 10.367 3.91315 10.065 3.42008C9.70126 2.96799 9.52899 2.39146 9.58506 1.81392C9.64113 1.23639 9.92109 0.703759 10.365 0.330081C10.8662 0.0418164 11.4601 -0.0395341 12.0204 0.103332C12.5806 0.246199 13.063 0.602008 13.365 1.09508C13.7287 1.54717 13.901 2.12371 13.8449 2.70124C13.7889 3.27877 13.5089 3.8114 13.065 4.18508ZM2.565 6.76508C1.98518 6.6732 1.39241 6.81157 0.913189 7.15066C0.433971 7.48976 0.106262 8.00272 0 8.58008C0.0118186 9.17159 0.256137 9.73464 0.680058 10.1473C1.10398 10.56 1.67339 10.7891 2.265 10.7851C2.84509 10.8863 3.44175 10.7561 3.92691 10.4224C4.41207 10.0886 4.74707 9.57801 4.86 9.00008C4.85804 8.7046 4.79789 8.41241 4.683 8.14018C4.56811 7.86794 4.40072 7.62101 4.1904 7.41347C3.98007 7.20593 3.73093 7.04185 3.45719 6.9306C3.18345 6.81935 2.89048 6.7631 2.595 6.76508H2.565ZM22.2 15.1951C21.9286 15.0703 21.635 15.0008 21.3364 14.9907C21.0379 14.9806 20.7403 15.0301 20.461 15.1362C20.1818 15.2423 19.9264 15.403 19.7099 15.6088C19.4934 15.8146 19.3201 16.0615 19.2 16.3351C19.1369 16.6299 19.1337 16.9345 19.1906 17.2306C19.2475 17.5267 19.3634 17.8084 19.5313 18.0588C19.6992 18.3093 19.9157 18.5235 20.168 18.6886C20.4203 18.8537 20.7033 18.9665 21 19.0201C21.2714 19.1449 21.565 19.2143 21.8636 19.2244C22.1621 19.2346 22.4597 19.1851 22.739 19.079C23.0182 18.9729 23.2736 18.8122 23.4901 18.6064C23.7066 18.4005 23.8799 18.1536 24 17.8801C24.0634 17.5873 24.0677 17.2849 24.0127 16.9904C23.9577 16.696 23.8444 16.4155 23.6795 16.1654C23.5147 15.9153 23.3015 15.7007 23.0526 15.5341C22.8037 15.3674 22.524 15.2522 22.23 15.1951H22.2ZM20.34 10.2451C20.0073 9.99542 19.6009 9.86349 19.185 9.87008C18.4572 9.93018 17.7485 10.1341 17.1 10.4701C16.7447 10.6341 16.3789 10.7744 16.005 10.8901H15.69C15.5961 10.9108 15.4989 10.9108 15.405 10.8901C15 9.97508 16.5 9.00008 18.285 7.93508C18.8914 7.60883 19.4599 7.21644 19.98 6.76508C20.3961 6.30667 20.646 5.72169 20.6895 5.10413C20.733 4.48658 20.5677 3.87232 20.22 3.36008C19.9329 2.89588 19.5307 2.51381 19.0523 2.25098C18.574 1.98815 18.0358 1.85349 17.49 1.86008C17.2067 1.85969 16.9245 1.89496 16.65 1.96508C16.1585 2.08101 15.7042 2.31914 15.3293 2.65739C14.9543 2.99565 14.6708 3.42308 14.505 3.90008C14.16 4.75508 13.14 7.30508 12.135 7.71008C12.0359 7.72949 11.9341 7.72949 11.835 7.71008C11.6138 7.70259 11.3956 7.65692 11.19 7.57508C9.96 7.12508 9.6 5.62508 9.225 4.03508C9.06457 3.15891 8.79234 2.30695 8.415 1.50008C8.17043 1.04181 7.80465 0.659541 7.3576 0.395014C6.91055 0.130487 6.39941 -0.00612938 5.88 8.05856e-05C5.30686 0.011692 4.74338 0.149999 4.23 0.405081C3.872 0.589131 3.5547 0.843345 3.297 1.15258C3.03931 1.46182 2.84648 1.81976 2.73 2.20508C2.58357 2.66415 2.532 3.1482 2.57841 3.62781C2.62483 4.10743 2.76826 4.57261 3 4.99508C3.63898 5.99088 4.39988 6.90294 5.265 7.71008C5.59239 8.0233 5.90283 8.35377 6.195 8.70008C6.41249 8.94283 6.57687 9.22833 6.67761 9.5383C6.77835 9.84826 6.81322 10.1759 6.78 10.5001C6.68279 10.762 6.52008 10.9947 6.30737 11.1759C6.09467 11.3571 5.83908 11.4808 5.565 11.5351H5.19C4.89755 11.5247 4.60651 11.4896 4.32 11.4301C3.94485 11.3508 3.56329 11.3056 3.18 11.2951H3C2.50224 11.3269 2.02675 11.513 1.63964 11.8275C1.25253 12.142 0.973032 12.5694 0.84 13.0501C0.685221 13.5092 0.678705 14.0053 0.821373 14.4683C0.964041 14.9313 1.24867 15.3377 1.635 15.6301C1.97288 15.8809 2.38429 16.0127 2.805 16.0051C3.4891 15.9504 4.15377 15.751 4.755 15.4201C5.18104 15.1991 5.64344 15.0568 6.12 15.0001H6.285C6.32317 15.0086 6.35846 15.0269 6.38739 15.0532C6.41632 15.0795 6.4379 15.1129 6.45 15.1501C6.52858 15.4213 6.49621 15.7127 6.36 15.9601C5.80418 16.8088 4.95508 17.4229 3.975 17.6851C3.38444 17.8608 2.85799 18.205 2.46025 18.6756C2.06252 19.1462 1.81078 19.7226 1.73592 20.3342C1.66107 20.9458 1.76635 21.5659 2.03886 22.1185C2.31136 22.6711 2.73924 23.1321 3.27 23.4451C3.81477 23.8292 4.46349 24.0384 5.13 24.0451C6.1389 23.9485 7.08103 23.4979 7.7894 22.773C8.49778 22.0482 8.92665 21.0959 9 20.0851V19.9501C9.135 19.0351 9.33 17.7751 10.05 17.3401C10.2442 17.2216 10.4675 17.1593 10.695 17.1601C11.0828 17.1781 11.4558 17.3142 11.7641 17.5501C12.0724 17.786 12.3012 18.1105 12.42 18.4801C13.155 21.2251 13.725 23.4001 16.14 23.4001C16.4527 23.3961 16.7643 23.361 17.07 23.2951C17.8256 23.2158 18.5231 22.8527 19.0214 22.2792C19.5198 21.7057 19.7819 20.9644 19.755 20.2051C19.6664 19.6213 19.4389 19.0673 19.0918 18.5896C18.7446 18.112 18.2879 17.7246 17.76 17.4601C17.4534 17.2574 17.1625 17.0317 16.89 16.7851C16.005 15.9301 15.855 15.4051 15.885 15.1051C15.9198 14.8698 16.0313 14.6526 16.2021 14.4871C16.373 14.3217 16.5937 14.2173 16.83 14.1901H17.055C17.31 14.1901 17.61 14.1901 17.895 14.1901C18.18 14.1901 18.57 14.1901 18.84 14.1901H19.14C19.6172 14.1642 20.0748 13.9919 20.4505 13.6967C20.8263 13.4014 21.102 12.9976 21.24 12.5401C21.3316 12.1166 21.2981 11.6757 21.1436 11.2709C20.9892 10.8661 20.7204 10.5149 20.37 10.2601L20.34 10.2451Z"
      fill="#81C554"
      strokeWidth="0"
    />
  ),
  [ICONS.FIRE]: buildIcon(
    <path
      d="M15.45 22.65C17.25 16.65 12.15 12.75 12.15 12.75C12.15 12.75 9.00001 18.15 9.60001 22.65C7.20001 21.45 5.55001 19.8 4.80001 17.7C3.60001 14.55 4.50001 11.1 5.25001 9C5.85001 10.2 7.80001 12.15 7.80001 12.15L7.95001 10.5C8.55001 2.25 12.6 0.9 14.4 0.75C14.4 1.8 14.7 4.8 17.1 7.95C18.75 10.05 20.55 12.45 20.4 16.5C20.1 20.1 17.4 21.9 15.45 22.65Z"
      strokeMiterlimit="10"
    />
  ),
  [ICONS.SLIME]: buildIcon(
    <path
      d="M5.09998 23.25C2.84998 23.25 1.64998 20.55 3.14998 18.9C4.19998 17.85 8.24998 17.1 7.04998 14.7C6.14998 12.9 3.59998 15.75 2.09998 15C1.34998 14.7 1.19998 13.5 1.79998 12.75C2.39998 11.85 3.29998 12 4.19998 12.15C5.84998 12.45 7.94998 11.7 7.49998 9.60003C6.89998 7.35003 4.34998 6.45003 3.44998 4.35003C2.69998 2.25003 4.64998 -0.299968 6.89998 1.05003C8.69998 2.10003 8.39997 5.25003 9.29997 6.90003C10.2 8.40003 12 9.00003 13.2 7.65003C14.55 6.30003 14.55 3.15003 16.65 2.70003C18.45 2.25003 20.4 4.05003 19.5 5.85003C18.45 7.80003 15.15 7.80003 14.55 10.05C14.1 11.7 15.45 11.85 16.65 11.4C17.4 11.1 18.6 10.35 19.5 10.65C20.55 11.1 20.7 12.45 19.95 13.2C18.6 14.25 16.65 12.6 15.45 14.25C13.95 16.35 17.1 17.7 18.15 18.9C19.8 20.7 18.3 22.8 16.05 22.8C14.1 22.8 13.65 20.7 13.2 19.05C12.6 16.95 9.89997 15.3 8.54997 18C7.79997 19.8 8.24998 23.25 5.09998 23.25Z"
      strokeMiterlimit="10"
    />
  ),
  [ICONS.BELL]: buildIcon(
    <g>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </g>
  ),
  [ICONS.BELL_ON]: buildIcon(
    <g>
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        fill="currentColor"
      />
      <path d="M4.9162 1C2.45164 3.45929 1.8302 5.30812 1.76171 9.24794" />
      <path d="M18.7617 1C21.2263 3.45929 21.8477 5.30812 21.9162 9.24794" />
      <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" />
    </g>
  ),
  [ICONS.PIN]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-6 0 26 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.3333333,6 C11.3333333,8.94666667 8.94666667,11.3333333 6,11.3333333 C3.056,11.3333333 0.666666667,8.94666667 0.666666667,6 C0.666666667,3.05466667 3.056,0.666666667 6,0.666666667 C8.94666667,0.666666667 11.3333333,3.05466667 11.3333333,6 L11.3333333,6 Z" />
      <line x1="6" y1="11.3333333" x2="6" y2="23.3333333" />
      <path d="M6,3.33333333 C7.47333333,3.33333333 8.66666667,4.528 8.66666667,6" />
    </svg>
  ),
  [ICONS.CONTROVERSIAL]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-6 0 26 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.52,11.55s1-1.64,4.28-2.27A4.19,4.19,0,0,0,18,2.13l0,0a4.19,4.19,0,0,0-7.15,2.17C10.13,7.55,8.5,8.53,8.5,8.53" />
      <path d="M14.74,15.33,4.62,5.21a1.64,1.64,0,0,0-2.32,0h0a1.64,1.64,0,0,0,0,2.32L12.42,17.65a1.64,1.64,0,0,0,2.32,0h0A1.64,1.64,0,0,0,14.74,15.33Z" />
      <line x1="6.75" y1="11.98" x2="7.97" y2="13.2" />
      <line x1="10.24" y1="15.46" x2="7.97" y2="13.2" />
      <line x1="6.75" y1="11.98" x2="4.49" y2="9.71" />
      <path d="M10.24,15.46A4.81,4.81,0,1,1,4.49,9.71L6.75,12A2.71,2.71,0,1,0,8,13.2Z" />
      <path d="M17.1,4.58a1.4,1.4,0,0,1-.28,1.77" />
    </svg>
  ),
  [ICONS.NEW]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-6 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6.65" cy="14.71" r="0.34" transform="translate(-0.5 0.24) rotate(-1.96)" />
      <circle cx="4.28" cy="16.8" r="0.43" transform="translate(-0.57 0.16) rotate(-1.96)" />
      <circle cx="3.5" cy="13.91" r="0.43" transform="translate(-0.47 0.13) rotate(-1.96)" />
      <path d="M14.12,2.43c.39-.35,1-.75,1.37-1.1" />
      <path d="M.83,15.17c.07,2.12,1.83,4.27,3.95,4.08,3.39-.31,6.09-4.7,6.09-4.7s-2.35,1.75-2.41.25a3.59,3.59,0,0,1,1.31-3,14.73,14.73,0,0,0,2.47-3.76c.11-.24-4.49,3.11-5.23,3.52-1.17.66-1.73-.85-1-1.68.48-.51,6.38-6,6.38-6L3.2,11S.76,13,.83,15.17Z" />
      <path d="M7.51,4.57l-.18-.51a1.54,1.54,0,0,0-1.15-1L5.64,3l.51-.18a1.54,1.54,0,0,0,1-1.15l.1-.53.18.51a1.54,1.54,0,0,0,1.15,1l.53.1-.51.18A1.54,1.54,0,0,0,7.61,4Z" />
      <path d="M15.48,17.56l-.15-.4a1.21,1.21,0,0,0-.91-.78L14,16.3l.4-.15a1.21,1.21,0,0,0,.78-.91l.08-.42.15.4a1.21,1.21,0,0,0,.91.78l.42.08-.4.15a1.21,1.21,0,0,0-.78.91Z" />
      <path d="M3.08,8.07,3,7.77a.87.87,0,0,0-.66-.56L2,7.15,2.31,7a.87.87,0,0,0,.56-.66l.06-.3.1.29a.87.87,0,0,0,.66.56L4,7l-.29.1a.87.87,0,0,0-.56.66Z" />
      <line x1="17.73" y1="6.78" x2="12.48" y2="12.52" />
      <line x1="14.55" y1="6.03" x2="19.13" y2="1.86" />
    </svg>
  ),
  [ICONS.BEST]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-6 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="10.05 3 11.5 5.94 14.75 6.42 12.4 8.71 12.96 11.95 10.05 10.42 7.14 11.95 7.7 8.71 5.34 6.42 8.6 5.94 10.05 3" />
      <circle cx="10" cy="7.66" r="7" />
      <polyline points="8.6 15.08 6.43 19.33 5.18 17.17 2.63 17.39 4.87 13" />
      <polyline points="14.94 12.98 17.37 17.09 14.88 16.99 13.7 19.26 11.19 15.03" />
    </svg>
  ),
  [ICONS.CREATOR_LIKE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M12 4.65882C11.0118 2.4 8.61176 0.564705 6.63529 0.141176C3.24706 -0.564707 0 2.11765 0 6.63529C0 11.2941 12 21.7412 12 21.7412C12 21.7412 24 11.4353 24 6.63529C24 2.11765 20.4706 -0.564707 17.0824 0.282352C15.1059 0.564705 12.7059 2.25882 12 4.65882Z"
          fill="url(#paint0_linear)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="0.984988"
          y1="-1.58654"
          x2="28.1615"
          y2="20.8252"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2395" stopColor="#FA3661" />
          <stop offset="0.6871" stopColor="#FFB420" />
        </linearGradient>
        <clipPath id="clip0">
          <rect width="24" height="21.7412" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  [ICONS.CHEF]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m 5.8585986,19.685492 v 3.415632 c 0,0.269439 0.2185945,0.487951 0.4879486,0.487951 H 18.086586 c 0.270325,0 0.487946,-0.218539 0.45867,-0.487951 v -3.415632 z" />
      <path d="m 18.089706,2.6673324 c -0.458672,0 -0.914415,0.081053 -1.342833,0.2381801 -0.726068,-1.5175206 -2.625165,-2.67785413 -4.515474,-2.67785413 -1.902023,0 -3.8128297,1.16033353 -4.5408481,2.67785413 C 7.2621303,2.7483855 6.8063878,2.6673324 6.348691,2.6673324 c -2.1528256,0 -3.9045598,1.7507491 -3.9045598,3.9035835 0,2.0230385 1.4648199,3.6410591 3.4146614,3.8752841 v 8.262918 h 2.9276892 v -3.415632 c 0.00968,-0.26944 0.2273915,-0.487951 0.4977084,-0.487951 0.2693563,0 0.4879486,0.218539 0.4879486,0.487951 v 3.415632 h 1.9420352 v -4.391535 c 0,-0.269439 0.217626,-0.487951 0.487948,-0.487951 0.269357,0 0.487946,0.218539 0.487946,0.487951 v 4.391535 h 1.951795 v -3.415632 c 0.01964,-0.26944 0.238125,-0.487951 0.507465,-0.487951 0.270325,0 0.487949,0.218539 0.468432,0.487951 v 3.415632 h 2.927689 V 10.4462 c 1.980095,-0.234307 3.445891,-1.8522456 3.445891,-3.8752841 0,-2.1528344 -1.750758,-3.9035835 -3.901634,-3.9035835" />
    </svg>
  ),
  [ICONS.ANONYMOUS]: buildIcon(
    <g>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </g>
  ),
  [ICONS.CHANNEL_LEVEL_1]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.32001L14.025 8.02501C14.4776 8.85522 15.1598 9.53744 15.99 9.99001L19.68 12L15.975 14.025C15.1448 14.4776 14.4626 15.1598 14.01 15.99L12 19.68L9.97501 15.975C9.52419 15.1524 8.84761 14.4758 8.02501 14.025L4.32001 12L8.02501 9.97501C8.84761 9.52419 9.52419 8.84761 9.97501 8.02501L12 4.32001Z" />
    </svg>
  ),
  [ICONS.CHANNEL_LEVEL_2]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.705 7.31999L17.625 10.845C18.0591 11.6316 18.7099 12.2772 19.5 12.705L23.025 14.625L19.5 16.5C18.7154 16.9301 18.0701 17.5754 17.64 18.36L15.72 21.885L13.785 18.435C13.3625 17.6207 12.7106 16.9479 11.91 16.5L8.38499 14.64L11.91 12.705C12.7001 12.2772 13.3508 11.6316 13.785 10.845L15.705 7.31999ZM4.37999 4.31999C4.10558 4.81954 3.69454 5.23058 3.19499 5.50499L0.974991 6.67499L3.19499 7.88999C3.68451 8.14404 4.09453 8.5281 4.37999 8.99999L5.59499 11.22L6.80999 8.99999C7.0844 8.50045 7.49544 8.08941 7.99499 7.81499L10.215 6.59999L7.99499 5.44499C7.49544 5.17058 7.0844 4.75954 6.80999 4.25999L5.59499 2.05499L4.37999 4.31999Z" />
    </svg>
  ),
  [ICONS.CHANNEL_LEVEL_3]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 7.95L13.92 11.475C14.3519 12.2672 15.0028 12.9181 15.795 13.35L19.32 15.27L15.795 17.19C15.0104 17.6201 14.3651 18.2654 13.935 19.05L12 22.59L10.08 19.065C9.64989 18.2804 9.00456 17.6351 8.22 17.205L4.68 15.27L8.205 13.35C8.99718 12.9181 9.64814 12.2672 10.08 11.475L12 7.95ZM3.57 3.705C3.29213 4.2198 2.8698 4.64213 2.355 4.92L0 6.18L2.34 7.5C2.8548 7.77788 3.27713 8.2002 3.555 8.715L4.815 10.95L6.075 8.655C6.36202 8.16237 6.78348 7.76173 7.29 7.5L9.585 6.24L7.29 4.92C6.7752 4.64213 6.35287 4.2198 6.075 3.705L4.815 1.41L3.57 3.705ZM17.625 3.825C17.3305 4.36309 16.8881 4.80555 16.35 5.1L13.935 6.42L16.35 7.74C16.8881 8.03446 17.3305 8.47692 17.625 9.015L18.945 11.43L20.265 9C20.5595 8.46191 21.0019 8.01946 21.54 7.725L24 6.42L21.54 5.1C21.0019 4.80555 20.5595 4.36309 20.265 3.825L18.945 1.41L17.625 3.825Z" />
    </svg>
  ),
  [ICONS.CHANNEL_LEVEL_4]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 6.375L5.64 8.46C5.89614 8.92861 6.28139 9.31386 6.75 9.57L8.835 10.71L6.75 11.85C6.28139 12.1061 5.89614 12.4914 5.64 12.96L4.5 15L3.285 12.96C3.02886 12.4914 2.64361 12.1061 2.175 11.85L0.0899963 10.71L2.175 9.57C2.64361 9.31386 3.02886 8.92861 3.285 8.46L4.5 6.375ZM17.67 10.125C17.3718 10.6692 16.9242 11.1168 16.38 11.415L13.875 12.75L16.32 14.085C16.8642 14.3832 17.3118 14.8308 17.61 15.375L18.945 17.82L20.28 15.375C20.5782 14.8308 21.0258 14.3832 21.57 14.085L24 12.75L21.555 11.415C21.0108 11.1168 20.5632 10.6692 20.265 10.125L18.93 7.68L17.67 10.125ZM8.49 21C8.93984 21.2454 9.30955 21.6152 9.555 22.065L10.65 24L11.745 21.99C11.9975 21.5699 12.3608 21.2274 12.795 21L14.805 19.905L12.795 18.75C12.3451 18.5046 11.9754 18.1348 11.73 17.685L10.65 15.69L9.555 17.7C9.30955 18.1498 8.93984 18.5196 8.49 18.765L6.48 19.86L8.49 21ZM12.9 4.68C13.2986 4.8985 13.6265 5.22638 13.845 5.625L14.82 7.41L15.795 5.625C16.0135 5.22638 16.3414 4.8985 16.74 4.68L18.525 3.705L16.74 2.73C16.3414 2.5115 16.0135 2.18362 15.795 1.785L14.82 0L13.845 1.785C13.6265 2.18362 13.2986 2.5115 12.9 2.73L11.115 3.705L12.9 4.68Z" />
    </svg>
  ),
  [ICONS.CHANNEL_LEVEL_5]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.89L13.875 8.31C14.291 9.07838 14.9216 9.70903 15.69 10.125L19.11 12L15.69 13.875C14.9216 14.291 14.291 14.9216 13.875 15.69L12 19.11L10.125 15.69C9.70903 14.9216 9.07838 14.291 8.31 13.875L4.89 12L8.31 10.125C9.07838 9.70903 9.70903 9.07838 10.125 8.31L12 4.89ZM3 1.89C2.76692 2.36024 2.3952 2.74767 1.935 3L0 4.005L1.935 5.055C2.38429 5.28744 2.75483 5.64753 3 6.09L4.05 8.025L5.1 6.09C5.33543 5.65943 5.68943 5.30543 6.12 5.07L8.055 4.02L6.09 3C5.65943 2.76457 5.30543 2.41057 5.07 1.98L4.005 0L3 1.89ZM18.975 1.89C18.7396 2.32057 18.3856 2.67457 17.955 2.91L16.02 3.96L17.955 5.01C18.3856 5.24543 18.7396 5.59943 18.975 6.03L20.025 7.965L21 6.09C21.2354 5.65943 21.5894 5.30543 22.02 5.07L24 4.005L22.065 3C21.6114 2.75957 21.2404 2.38858 21 1.935L19.995 0L18.975 1.89ZM3 17.91C2.76457 18.3406 2.41057 18.6946 1.98 18.93L0 19.995L1.935 21.045C2.36557 21.2804 2.71957 21.6344 2.955 22.065L4.005 24L5.055 22.065C5.28744 21.6157 5.64753 21.2452 6.09 21L8.025 19.95L6.09 18.9C5.65943 18.6646 5.30543 18.3106 5.07 17.88L4.02 15.945L3 17.91ZM18.975 17.91C18.7396 18.3406 18.3856 18.6946 17.955 18.93L16.02 19.98L17.955 21.03C18.3856 21.2654 18.7396 21.6194 18.975 22.05L20.025 23.985L21.075 22.05C21.3104 21.6194 21.6644 21.2654 22.095 21.03L24.03 19.98L22.095 18.93C21.6644 18.6946 21.3104 18.3406 21.075 17.91L20.025 15.975L18.975 17.91Z" />
    </svg>
  ),
  [ICONS.WILD_WEST]: buildIcon(
    <g transform="matrix(1,0,0,1,0,0)">
      <path
        d="M12.546,23.25H11.454A10.7,10.7,0,0,1,2.161,7.235L3.75,4.453V2.25A1.5,1.5,0,0,1,5.25.75h3a1.5,1.5,0,0,1,1.5,1.5v3a2.988,2.988,0,0,1-.4,1.488L7.37,10.211a4.7,4.7,0,0,0,4.084,7.039h1.092a4.7,4.7,0,0,0,4.084-7.039L14.646,6.738a2.988,2.988,0,0,1-.4-1.488v-3a1.5,1.5,0,0,1,1.5-1.5h3a1.5,1.5,0,0,1,1.5,1.5v2.2l1.589,2.782A10.7,10.7,0,0,1,12.546,23.25Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12,19.875a.375.375,0,0,1,.375.375"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M11.625,20.25A.375.375,0,0,1,12,19.875"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12,20.625a.375.375,0,0,1-.375-.375"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.375,20.25a.375.375,0,0,1-.375.375"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M17.813,17.313a.375.375,0,0,1,.529-.024"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M17.836,17.843a.376.376,0,0,1-.023-.53"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.366,17.819a.375.375,0,0,1-.53.024"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.342,17.289a.375.375,0,0,1,.024.53"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M19.843,11.294a.376.376,0,0,1,.34-.407"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.25,11.634a.375.375,0,0,1-.407-.34"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.59,11.227a.374.374,0,0,1-.34.407"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.183,10.887a.375.375,0,0,1,.407.34"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.187,17.313a.375.375,0,0,0-.529-.024"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.164,17.843a.376.376,0,0,0,.023-.53"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M5.634,17.819a.375.375,0,0,0,.53.024"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M5.658,17.289a.375.375,0,0,0-.024.53"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M4.157,11.294a.376.376,0,0,0-.34-.407"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.75,11.634a.375.375,0,0,0,.407-.34"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.41,11.227a.374.374,0,0,0,.34.407"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.817,10.887a.375.375,0,0,0-.407.34"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M20.25 4.5L18 4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M6 4.5L3.75 4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </g>
  ),
  [ICONS.PEACE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M0.500 12.000 A11.500 11.500 0 1 0 23.500 12.000 A11.500 11.500 0 1 0 0.500 12.000 Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5,3.642a8.5,8.5,0,0,1,6.24,11.877L13.5,9.354Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5,13.6l4.471,4.455A8.529,8.529,0,0,1,13.5,20.365Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.33,15.549,10.5,9.354V3.635A8.517,8.517,0,0,0,3.5,12,7.583,7.583,0,0,0,4.33,15.549Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5,20.364a8.543,8.543,0,0,1-4.463-2.306L10.5,13.6Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
  [ICONS.UNIVERSE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M5.33,17.848A9.545,9.545,0,0,1,16.466,2.488"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.982,17.78C.769,19.905.363,21.554,1.048,22.24c1.04,1.039,4.294-.43,8.062-3.418"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.423,18.067l-3.58-3.58L17.8,6.53A5.054,5.054,0,0,1,20.153,5.2L22.2,4.686a.844.844,0,0,1,1.023,1.023l-.512,2.048a5.059,5.059,0,0,1-1.332,2.352Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.843,14.487,6.911,13.51a.422.422,0,0,1-.165-.7l1.022-1.022a3.383,3.383,0,0,1,3.462-.817l1.6.532Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.423,18.067,14.4,21a.422.422,0,0,0,.7.165l1.022-1.022a3.383,3.383,0,0,0,.817-3.462l-.532-1.6Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
  [ICONS.CHEESE]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M18.500 12.639 A1.500 1.500 0 1 0 21.500 12.639 A1.500 1.500 0 1 0 18.500 12.639 Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.000 14.139 A1.000 1.000 0 1 0 7.000 14.139 A1.000 1.000 0 1 0 5.000 14.139 Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.000 18.139 A2.000 2.000 0 1 0 13.000 18.139 A2.000 2.000 0 1 0 9.000 18.139 Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.5,8.493V19.761a1,1,0,0,1-.871.991l-21,2.74A1,1,0,0,1,.5,22.5a1.045,1.045,0,0,1,.686-.982A2,2,0,0,0,.5,17.639V11.945a1,1,0,0,1,.339-.751L12.709.749a1,1,0,0,1,.7-.248C17.854.674,23.5,3.642,23.5,8.493"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M23.5 8.493L0.616 11.478" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M18,17.389a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5,12.889a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
  [ICONS.PORK_BUN]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M11.247,5.3a1,1,0,0,1,1.507,0C15.378,8.3,23.5,11.518,23.5,16.5c0,5.706-5.794,7-11.5,7S.5,22.206.5,16.5C.5,11.518,8.623,8.3,11.247,5.3Z"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10,9.874a13.068,13.068,0,0,1-2.559,2.12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14,9.874a13.068,13.068,0,0,0,2.559,2.12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 10.5L12 12.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6,.5C4.5,2,7.5,3,6,4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18,.5c1.5,1.5-1.5,2.5,0,4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  [ICONS.MIND_BLOWN]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      width={props.size || '18'}
      height={props.size || '16'}
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M21.2,5a3.034,3.034,0,0,0-3.067-3,3.077,3.077,0,0,0-1.847.62,5.392,5.392,0,0,0-8.572,0A3.077,3.077,0,0,0,5.867,2,3.034,3.034,0,0,0,2.8,5"
          fill="none"
        />
        <path d="M2.8,5a2.251,2.251,0,1,0,0,4.5H5.5" fill="none" />
        <path d="M21.2,5a2.251,2.251,0,1,1,0,4.5H18.5" fill="none" />
        <path d="M8.5,7.5V9.366A3.134,3.134,0,0,1,5.366,12.5" fill="none" />
        <path d="M15.5,7.5V9.366A3.134,3.134,0,0,0,18.634,12.5" fill="none" />
        <path d="M10.5 8.5L10.5 10.5" fill="none" />
        <path d="M13.5 8.5L13.5 10.5" fill="none" />
        <path d="M8.5,15.75a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25" fill="none" />
        <path d="M15.5,15.75a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25" fill="none" />
        <path d="M12,17.5A1.5,1.5,0,0,0,10.5,19v1a1.5,1.5,0,0,0,3,0V19A1.5,1.5,0,0,0,12,17.5Z" fill="none" />
        <path d="M18.634,12.5S18,13.5,12,13.5s-6.634-1-6.634-1a7.5,7.5,0,1,0,13.268,0Z" fill="none" />
      </g>
    </svg>
  ),
  [ICONS.MOVIES]: (props: CustomProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path d="M19.5,11.75a3.751,3.751,0,0,1,3.124-3.7.75.75,0,0,0,.626-.739V5a1.5,1.5,0,0,0-1.5-1.5H2.25A1.5,1.5,0,0,0,.75,5V7.313a.749.749,0,0,0,.626.739,3.751,3.751,0,0,1,0,7.4.75.75,0,0,0-.626.739V18.5A1.5,1.5,0,0,0,2.25,20h19.5a1.5,1.5,0,0,0,1.5-1.5V16.187a.749.749,0,0,0-.626-.739A3.751,3.751,0,0,1,19.5,11.75Z" />
        <path d="M4.5 6.5L6.75 6.5" />
        <path d="M10.5 6.5L13.5 6.5" />
        <path d="M17.25 6.5L19.5 6.5" />
        <path d="M4.5 17L6.75 17" />
        <path d="M10.5 17L13.5 17" />
        <path d="M17.25 17L19.5 17" />
        <path d="M12.624,10.436a.75.75,0,0,0-1.248,0l-1.6,2.4A.75.75,0,0,0,10.4,14h3.2a.75.75,0,0,0,.624-1.166Z" />
      </g>
    </svg>
  ),
  [ICONS.LIVESTREAM]: (props: CustomProps) => (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 36 36"
      width={props.size || '18'}
      height={props.size || '16'}
      className={props.className}
    >
      <g id="XMLID_505_">
        <linearGradient
          id="XMLID_420_"
          gradientUnits="userSpaceOnUse"
          x1="-519.065"
          y1="1525.4059"
          x2="-508.6628"
          y2="1525.4059"
        >
          <stop offset="1.970443e-002" stopColor="#FFC200" />
          <stop offset="0.3866" stopColor="#FF31BD" />
          <stop offset="0.6245" stopColor="#8E31BD" />
          <stop offset="0.7758" stopColor="#6E8EDE" />
          <stop offset="1" stopColor="#57EABA" />
        </linearGradient>
        <circle
          id="XMLID_508_"
          fill="none"
          stroke="url(XMLID_420_)"
          strokeWidth="2.4678"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          cx="-513.9"
          cy="1525.4"
          r="4"
        />
        <path
          id="XMLID_507_"
          fill="#FF7B5B"
          d="M-521,1518.3c-1.8,1.8-2.9,4.3-2.9,7.1c0,2.6,1,4.9,2.5,6.7L-521,1518.3z"
        />
        <path
          id="XMLID_506_"
          fill="#FF7B5B"
          d="M-506.9,1532.1c1.8-1.8,2.9-4.3,2.9-7.1c0-2.6-1-4.9-2.5-6.7L-506.9,1532.1z"
        />
      </g>
      <rect id="XMLID_125_" x="0" y="0" fill="none" width="36" height="36" stroke="none" />
      {/* }//fill="#FFFFFF" */}
      <linearGradient
        id="XMLID_421_"
        gradientUnits="userSpaceOnUse"
        x1="-1625.151"
        y1="-2518.4661"
        x2="-1596.6696"
        y2="-2518.4661"
        gradientTransform="matrix(-1 0 0 -1 -1589.489 -2500.4661)"
      >
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <path
        id="XMLID_124_"
        fill="none"
        stroke="url(#XMLID_421_)"
        strokeWidth="2.94"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M21.4,5.2L21.4,5.2c7.1,0,12.8,5.7,12.8,12.8v0c0,7.1-5.7,12.8-12.8,12.8H8.7V18C8.7,10.9,14.4,5.2,21.4,5.2z"
      />
      <linearGradient id="XMLID_422_" gradientUnits="userSpaceOnUse" x1="18.041" y1="32.147" x2="38.7776" y2="-0.9289">
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <rect id="XMLID_123_" x="26.9" y="13.8" fill="url(#XMLID_422_)" stroke="none" width="2.8" height="3.8" />
      <linearGradient
        id="XMLID_423_"
        gradientUnits="userSpaceOnUse"
        x1="13.0856"
        y1="29.0402"
        x2="33.8223"
        y2="-4.0356"
      >
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <rect id="XMLID_122_" x="20" y="13.8" fill="url(#XMLID_422_)" stroke="none" width="2.8" height="3.8" />
      <linearGradient id="XMLID_424_" gradientUnits="userSpaceOnUse" x1="0.338" y1="17.7555" x2="17.2654" y2="17.7555">
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <circle
        id="XMLID_121_"
        fill="none"
        stroke="#6E8EDE"
        strokeWidth="2.94"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        cx="8.8"
        cy="17.8"
        r="6"
      />
    </svg>
  ),
  [ICONS.LIVESTREAM_SOLID]: (props: CustomProps) => (
    <svg
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      fill="none"
      width={props.size || '18'}
      height={props.size || '16'}
      viewBox="0 0 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <style>{'.prefix__st1{fill:#ff7b5b}.prefix__st3{fill:#79d1b6}'}</style>
      <g id="prefix__XMLID_505_">
        <linearGradient
          id="prefix__XMLID_410_"
          gradientUnits="userSpaceOnUse"
          x1={-571.815}
          y1={1525.406}
          x2={-561.413}
          y2={1525.406}
        >
          <stop offset={0.02} stopColor="#ffc200" />
          <stop offset={0.387} stopColor="#ff31bd" />
          <stop offset={0.625} stopColor="#8e31bd" />
          <stop offset={0.776} stopColor="#6e8ede" />
          <stop offset={1} stopColor="#57eaba" />
        </linearGradient>
        <circle
          id="prefix__XMLID_508_"
          cx={-566.6}
          cy={1525.4}
          r={4}
          fill="none"
          stroke="url(#prefix__XMLID_410_)"
          strokeWidth={2.468}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <path
          id="prefix__XMLID_507_"
          className="prefix__st1"
          d="M-573.7 1518.3c-1.8 1.8-2.9 4.3-2.9 7.1 0 2.6 1 4.9 2.5 6.7l.4-13.8z"
        />
        <path
          id="prefix__XMLID_506_"
          className="prefix__st1"
          d="M-559.6 1532.1c1.8-1.8 2.9-4.3 2.9-7.1 0-2.6-1-4.9-2.5-6.7l-.4 13.8z"
        />
      </g>
      <path
        id="prefix__XMLID_20_"
        d="M21.4 5.2h0c7.1 0 12.8 5.7 12.8 12.8v0c0 7.1-5.7 12.8-12.8 12.8H8.7V18c0-7.1 5.7-12.8 12.7-12.8z"
        fill="none"
        stroke="#e729e1"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <path id="prefix__XMLID_19_" className="prefix__st3" stroke="none" d="M26.9 13.8h2.8v3.8h-2.8z" />
      <path id="prefix__XMLID_18_" className="prefix__st3" stroke="none" d="M20 13.8h2.8v3.8H20z" />
      <circle
        id="prefix__XMLID_17_"
        cx={8.8}
        cy={17.8}
        r={6}
        fill="none"
        stroke="#ffa100"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </svg>
  ),
  [ICONS.LIVESTREAM_MONOCHROME]: (props: CustomProps) => (
    <svg
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      fill="currentColor"
      stroke="currentColor"
      width={props.size || '18'}
      height={props.size || '16'}
      viewBox="0 0 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <g id="prefix__XMLID_505_">
        <linearGradient
          id="prefix__XMLID_410_"
          gradientUnits="userSpaceOnUse"
          x1={-571.815}
          y1={1525.406}
          x2={-561.413}
          y2={1525.406}
        >
          <stop offset={0.02} stopColor="#ffc200" />
          <stop offset={0.387} stopColor="#ff31bd" />
          <stop offset={0.625} stopColor="#8e31bd" />
          <stop offset={0.776} stopColor="#6e8ede" />
          <stop offset={1} stopColor="#57eaba" />
        </linearGradient>
        <circle
          id="prefix__XMLID_508_"
          cx={-566.6}
          cy={1525.4}
          r={4}
          fill="none"
          strokeWidth={2.468}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <path id="prefix__XMLID_507_" d="M-573.7 1518.3c-1.8 1.8-2.9 4.3-2.9 7.1 0 2.6 1 4.9 2.5 6.7l.4-13.8z" />
        <path id="prefix__XMLID_506_" d="M-559.6 1532.1c1.8-1.8 2.9-4.3 2.9-7.1 0-2.6-1-4.9-2.5-6.7l-.4 13.8z" />
      </g>
      <path
        id="prefix__XMLID_20_"
        d="M21.4 5.2h0c7.1 0 12.8 5.7 12.8 12.8v0c0 7.1-5.7 12.8-12.8 12.8H8.7V18c0-7.1 5.7-12.8 12.7-12.8z"
        fill="none"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <path id="prefix__XMLID_19_" d="M26.9 13.8h2.8v3.8h-2.8z" />
      <path id="prefix__XMLID_18_" d="M20 13.8h2.8v3.8H20z" />
      <circle
        id="prefix__XMLID_17_"
        cx={8.8}
        cy={17.8}
        r={6}
        fill="none"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </svg>
  ),

  [ICONS.LIVESTREAM]: (props: CustomProps) => (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 36 36"
      width={props.size || '18'}
      height={props.size || '16'}
    >
      <g id="XMLID_505_">
        <linearGradient
          id="XMLID_420_"
          gradientUnits="userSpaceOnUse"
          x1="-519.065"
          y1="1525.4059"
          x2="-508.6628"
          y2="1525.4059"
        >
          <stop offset="1.970443e-002" stopColor="#FFC200" />
          <stop offset="0.3866" stopColor="#FF31BD" />
          <stop offset="0.6245" stopColor="#8E31BD" />
          <stop offset="0.7758" stopColor="#6E8EDE" />
          <stop offset="1" stopColor="#57EABA" />
        </linearGradient>
        <circle
          id="XMLID_508_"
          fill="none"
          stroke="url(XMLID_420_)"
          strokeWidth="2.4678"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          cx="-513.9"
          cy="1525.4"
          r="4"
        />
        <path
          id="XMLID_507_"
          fill="#FF7B5B"
          d="M-521,1518.3c-1.8,1.8-2.9,4.3-2.9,7.1c0,2.6,1,4.9,2.5,6.7L-521,1518.3z"
        />
        <path
          id="XMLID_506_"
          fill="#FF7B5B"
          d="M-506.9,1532.1c1.8-1.8,2.9-4.3,2.9-7.1c0-2.6-1-4.9-2.5-6.7L-506.9,1532.1z"
        />
      </g>
      <rect id="XMLID_125_" x="0" y="0" fill="none" width="36" height="36" stroke="none" />
      {/* }//fill="#FFFFFF" */}
      <linearGradient
        id="XMLID_421_"
        gradientUnits="userSpaceOnUse"
        x1="-1625.151"
        y1="-2518.4661"
        x2="-1596.6696"
        y2="-2518.4661"
        gradientTransform="matrix(-1 0 0 -1 -1589.489 -2500.4661)"
      >
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <path
        id="XMLID_124_"
        fill="none"
        stroke="url(#XMLID_421_)"
        strokeWidth="2.94"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M21.4,5.2L21.4,5.2c7.1,0,12.8,5.7,12.8,12.8v0c0,7.1-5.7,12.8-12.8,12.8H8.7V18C8.7,10.9,14.4,5.2,21.4,5.2z"
      />
      <linearGradient id="XMLID_422_" gradientUnits="userSpaceOnUse" x1="18.041" y1="32.147" x2="38.7776" y2="-0.9289">
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <rect id="XMLID_123_" x="26.9" y="13.8" fill="url(#XMLID_422_)" stroke="none" width="2.8" height="3.8" />
      <linearGradient
        id="XMLID_423_"
        gradientUnits="userSpaceOnUse"
        x1="13.0856"
        y1="29.0402"
        x2="33.8223"
        y2="-4.0356"
      >
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <rect id="XMLID_122_" x="20" y="13.8" fill="url(#XMLID_422_)" stroke="none" width="2.8" height="3.8" />
      <linearGradient id="XMLID_424_" gradientUnits="userSpaceOnUse" x1="0.338" y1="17.7555" x2="17.2654" y2="17.7555">
        <stop offset="1.970443e-002" stopColor="#FFC200" />
        <stop offset="0.4731" stopColor="#FF31BD" />
        <stop offset="0.6947" stopColor="#8E31BD" />
        <stop offset="1" stopColor="#57EABA" />
      </linearGradient>
      <circle
        id="XMLID_121_"
        fill="none"
        stroke="#6E8EDE"
        strokeWidth="2.94"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        cx="8.8"
        cy="17.8"
        r="6"
      />
    </svg>
  ),
  [ICONS.LIVESTREAM_SOLID]: (props: CustomProps) => (
    <svg
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      fill="none"
      width={props.size || '18'}
      height={props.size || '16'}
      viewBox="0 0 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <style>{'.prefix__st1{fill:#ff7b5b}.prefix__st3{fill:#79d1b6}'}</style>
      <g id="prefix__XMLID_505_">
        <linearGradient
          id="prefix__XMLID_410_"
          gradientUnits="userSpaceOnUse"
          x1={-571.815}
          y1={1525.406}
          x2={-561.413}
          y2={1525.406}
        >
          <stop offset={0.02} stopColor="#ffc200" />
          <stop offset={0.387} stopColor="#ff31bd" />
          <stop offset={0.625} stopColor="#8e31bd" />
          <stop offset={0.776} stopColor="#6e8ede" />
          <stop offset={1} stopColor="#57eaba" />
        </linearGradient>
        <circle
          id="prefix__XMLID_508_"
          cx={-566.6}
          cy={1525.4}
          r={4}
          fill="none"
          stroke="url(#prefix__XMLID_410_)"
          strokeWidth={2.468}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <path
          id="prefix__XMLID_507_"
          className="prefix__st1"
          d="M-573.7 1518.3c-1.8 1.8-2.9 4.3-2.9 7.1 0 2.6 1 4.9 2.5 6.7l.4-13.8z"
        />
        <path
          id="prefix__XMLID_506_"
          className="prefix__st1"
          d="M-559.6 1532.1c1.8-1.8 2.9-4.3 2.9-7.1 0-2.6-1-4.9-2.5-6.7l-.4 13.8z"
        />
      </g>
      <path
        id="prefix__XMLID_20_"
        d="M21.4 5.2h0c7.1 0 12.8 5.7 12.8 12.8v0c0 7.1-5.7 12.8-12.8 12.8H8.7V18c0-7.1 5.7-12.8 12.7-12.8z"
        fill="none"
        stroke="#e729e1"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <path id="prefix__XMLID_19_" className="prefix__st3" stroke="none" d="M26.9 13.8h2.8v3.8h-2.8z" />
      <path id="prefix__XMLID_18_" className="prefix__st3" stroke="none" d="M20 13.8h2.8v3.8H20z" />
      <circle
        id="prefix__XMLID_17_"
        cx={8.8}
        cy={17.8}
        r={6}
        fill="none"
        stroke="#ffa100"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </svg>
  ),
  [ICONS.LIVESTREAM_MONOCHROME]: (props: CustomProps) => (
    <svg
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      fill="currentColor"
      stroke="currentColor"
      width={props.size || '18'}
      height={props.size || '16'}
      viewBox="0 0 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <g id="prefix__XMLID_505_">
        <linearGradient
          id="prefix__XMLID_410_"
          gradientUnits="userSpaceOnUse"
          x1={-571.815}
          y1={1525.406}
          x2={-561.413}
          y2={1525.406}
        >
          <stop offset={0.02} stopColor="#ffc200" />
          <stop offset={0.387} stopColor="#ff31bd" />
          <stop offset={0.625} stopColor="#8e31bd" />
          <stop offset={0.776} stopColor="#6e8ede" />
          <stop offset={1} stopColor="#57eaba" />
        </linearGradient>
        <circle
          id="prefix__XMLID_508_"
          cx={-566.6}
          cy={1525.4}
          r={4}
          fill="none"
          strokeWidth={2.468}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
        <path id="prefix__XMLID_507_" d="M-573.7 1518.3c-1.8 1.8-2.9 4.3-2.9 7.1 0 2.6 1 4.9 2.5 6.7l.4-13.8z" />
        <path id="prefix__XMLID_506_" d="M-559.6 1532.1c1.8-1.8 2.9-4.3 2.9-7.1 0-2.6-1-4.9-2.5-6.7l-.4 13.8z" />
      </g>
      <path
        id="prefix__XMLID_20_"
        d="M21.4 5.2h0c7.1 0 12.8 5.7 12.8 12.8v0c0 7.1-5.7 12.8-12.8 12.8H8.7V18c0-7.1 5.7-12.8 12.7-12.8z"
        fill="none"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
      <path id="prefix__XMLID_19_" d="M26.9 13.8h2.8v3.8h-2.8z" />
      <path id="prefix__XMLID_18_" d="M20 13.8h2.8v3.8H20z" />
      <circle
        id="prefix__XMLID_17_"
        cx={8.8}
        cy={17.8}
        r={6}
        fill="none"
        strokeWidth={2.94}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
      />
    </svg>
  ),
  [ICONS.STACK]: (props: CustomProps) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      fill="none"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path d="M22.91,6.953,12.7,1.672a1.543,1.543,0,0,0-1.416,0L1.076,6.953a.615.615,0,0,0,0,1.094l10.209,5.281a1.543,1.543,0,0,0,1.416,0L22.91,8.047a.616.616,0,0,0,0-1.094Z" />
        <path d="M.758,12.75l10.527,5.078a1.543,1.543,0,0,0,1.416,0L23.258,12.75" />
        <path d="M.758,17.25l10.527,5.078a1.543,1.543,0,0,0,1.416,0L23.258,17.25" />
      </g>
    </svg>
  ),
  [ICONS.TIME]: (props: CustomProps) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width={props.size || '18'}
      height={props.size || '18'}
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      fill="none"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path d="M1.500 12.000 A10.500 10.500 0 1 0 22.500 12.000 A10.500 10.500 0 1 0 1.500 12.000 Z" />
        <path d="M12 12L12 8.25" />
        <path d="M12 12L16.687 16.688" />
      </g>
    </svg>
  ),
};
