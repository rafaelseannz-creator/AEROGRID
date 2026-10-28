import type { ColorValue } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const ICONS = {
  home: <Path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  thermometer: <Path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />,
  bolt: <Path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  cycle: (
    <>
      <Path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <Path d="M21 3v5h-5" />
    </>
  ),
  grid: (
    <>
      <Rect x={3} y={3} width={7} height={7} rx={1.5} />
      <Rect x={14} y={3} width={7} height={7} rx={1.5} />
      <Rect x={3} y={14} width={7} height={7} rx={1.5} />
      <Rect x={14} y={14} width={7} height={7} rx={1.5} />
    </>
  ),
  power: (
    <>
      <Path d="M12 2v10" />
      <Path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
    </>
  ),
  snowflake: (
    <>
      <Path d="M12 2v20" />
      <Path d="M2 12h20" />
      <Path d="m4.9 4.9 14.2 14.2" />
      <Path d="m19.1 4.9-14.2 14.2" />
    </>
  ),
  wind: (
    <>
      <Path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <Path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      <Path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
    </>
  ),
  leaf: (
    <>
      <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <Path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </>
  ),
  unit: (
    <>
      <Rect x={3} y={5} width={18} height={12} rx={3} />
      <Path d="M7 21h10" />
      <Path d="M7 9h10" />
      <Path d="M7 13h6" />
    </>
  ),
  arrow: (
    <>
      <Path d="M5 12h14" />
      <Path d="m13 6 6 6-6 6" />
    </>
  ),
  plus: (
    <>
      <Path d="M12 5v14" />
      <Path d="M5 12h14" />
    </>
  ),
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  color,
  size = 22,
  strokeWidth = 1.8,
}: {
  name: IconName;
  color: ColorValue;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {ICONS[name]}
    </Svg>
  );
}
