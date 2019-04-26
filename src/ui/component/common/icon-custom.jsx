// @flow
import * as ICONS from 'constants/icons';
import React from 'react';

type IconProps = {
  size: number,
  color: string,
};

// Returns a react component
const buildIcon = (iconStrokes: React$Node, options?: {} = {}) => (props: IconProps) => {
  const { size = 24, color = 'currentColor', ...otherProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...options}
      {...otherProps}
    >
      {iconStrokes}
    </svg>
  );
};

export const customIcons = {
  [ICONS.ARROW_LEFT]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <path d="M4, 12 L21, 12" />
      <polyline
        strokeLinejoin="round"
        transform="translate(7.000000, 12.000000) scale(-1, 1) translate(-7.000000, -12.000000)"
        points="3 4 11 12 3 20"
      />
    </g>
  ),
  [ICONS.ARROW_RIGHT]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <path d="M3, 12 L20, 12" />
      <polyline strokeLinejoin="round" points="13 4 21 12 13 20" />
    </g>
  ),
  [ICONS.VIEW]: buildIcon(
    <g fill="none" fillRule="evenodd">
      <path
        d="M2, 12 C2, 12 5, 5 12, 5 C19, 5 22, 12 22, 12 C22, 12 19, 19 12, 19 C5, 19 2, 12 2, 12 Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
      <path d="M12, 5 L12, 3" strokeLinecap="round" />
      <path d="M18, 6.5 L19, 5" strokeLinecap="round" />
      <path d="M21, 10 L22.5, 9" strokeLinecap="round" />
      <path
        d="M1.5, 10 L3, 9"
        strokeLinecap="round"
        transform="translate(2.250000, 9.500000) scale(1, -1) translate(-2.250000, -9.500000)"
      />
      <path
        d="M5, 6.5 L6, 5"
        strokeLinecap="round"
        transform="translate(5.500000, 5.750000) scale(-1, 1) translate(-5.500000, -5.750000)"
      />
    </g>
  ),

  [ICONS.HOME]: buildIcon(
    <g strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1, 11 L12, 2 C12, 2 22.9999989, 11.0000005 23, 11" />
      <path d="M3, 10 C3, 10 3, 10.4453982 3, 10.9968336 L3, 20.0170446 C3, 20.5675806 3.43788135, 21.0138782 4.00292933, 21.0138781 L8.99707067, 21.0138779 C9.55097324, 21.0138779 10, 20.5751284 10, 20.0089602 L10, 15.0049177 C10, 14.449917 10.4433532, 14 11.0093689, 14 L12.9906311, 14 C13.5480902, 14 14, 14.4387495 14, 15.0049177 L14, 20.0089602 C14, 20.5639609 14.4378817, 21.0138779 15.0029302, 21.0138779 L19.9970758, 21.0138781 C20.5509789, 21.0138782 21.000006, 20.56848 21.000006, 20.0170446 L21.0000057, 10" />
    </g>
  ),
  [ICONS.MENU]: buildIcon(
    <path
      d="M3.5, 7 C3.5, 7.27910535 3.72002141, 7.5 3.99339768, 7.5 L20.0066023, 7.5 C20.2782464, 7.5 20.5, 7.27680164 20.5, 7 C20.5, 6.72089465 20.2799786, 6.5 20.0066023, 6.5 L3.99339768, 6.5 C3.72175357, 6.5 3.5, 6.72319836 3.5, 7 Z M3.5, 12 C3.5, 12.2791054 3.72002141, 12.5 3.99339768, 12.5 L20.0066023, 12.5 C20.2782464, 12.5 20.5, 12.2768016 20.5, 12 C20.5, 11.7208946 20.2799786, 11.5 20.0066023, 11.5 L3.99339768, 11.5 C3.72175357, 11.5 3.5, 11.7231984 3.5, 12 Z M3.5, 17 C3.5, 17.2791054 3.72002141, 17.5 3.99339768, 17.5 L20.0066023, 17.5 C20.2782464, 17.5 20.5, 17.2768016 20.5, 17 C20.5, 16.7208946 20.2799786, 16.5 20.0066023, 16.5 L3.99339768, 16.5 C3.72175357, 16.5 3.5, 16.7231984 3.5, 17 Z"
      fill="none"
      fillRule="evenodd"
      strokeWidth="1"
    />
  ),
  [ICONS.PLAY]: buildIcon(
    <g fill="white" fillRule="evenodd" strokeLinejoin="round">
      <polygon points="5 21 5 3 21 12" />
    </g>
  ),
  [ICONS.UPLOAD]: buildIcon(
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
  [ICONS.PUBLISHED]: buildIcon(
    <g fill="none" fillRule="evenodd" strokeLinecap="round">
      <path
        d="M8, 18 L5, 18 L5, 18 C2.790861, 18 1, 16.209139 1, 14 C1, 11.790861 2.790861, 10 5, 10 C5.35840468, 10 5.70579988, 10.0471371 6.03632437, 10.1355501 C6.01233106, 9.92702603 6, 9.71495305 6, 9.5 C6, 6.46243388 8.46243388, 4 11.5, 4 C14.0673313, 4 16.2238156, 5.7590449 16.8299648, 8.1376465 C17.2052921, 8.04765874 17.5970804, 8 18, 8 C20.7614237, 8 23, 10.2385763 23, 13 C23, 15.7614237 20.7614237, 18 18, 18 L16, 18, L8, 18"
        strokeLinejoin="round"
        transform="scale(1, 1.2) translate(0, -2)"
      />
    </g>
  ),
  // Extended from the feather-icons Heart
  [ICONS.UNSUBSCRIBE]: buildIcon(
    <path d="M 12,5.67 10.94,4.61 C 5.7533356,-0.57666427 -2.0266644,7.2033357 3.16,12.39 l 1.06,1.06 7.78,7.78 7.78,-7.78 1.06,-1.06 c 2.149101,-2.148092 2.149101,-5.6319078 0,-7.78 -2.148092,-2.1491008 -5.631908,-2.1491008 -7.78,0 L 9.4481298,8.2303201 15.320603,9.2419066 11.772427,13.723825" />
  ),
  // The LBRY icon is different from the base icon set so don't use buildIcon()
  [ICONS.LBRY]: props => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      x="0px"
      y="0px"
      viewBox="0 0 322 254"
      className="icon lbry-icon"
    >
      <path d="M296,85.9V100l-138.8,85.3L52.6,134l0.2-7.9l104,51.2L289,96.1v-5.8L164.2,30.1L25,116.2v38.5l131.8,65.2 l137.6-84.4l3.9,6l-141.1,86.4L18.1,159.1v-46.8l145.8-90.2C163.9,22.1,296,85.9,296,85.9z" />
      <path d="M294.3,150.9l2-12.6l-12.2-2.1l0.8-4.9l17.1,2.9l-2.8,17.5L294.3,150.9L294.3,150.9z" />
    </svg>
  ),
};
