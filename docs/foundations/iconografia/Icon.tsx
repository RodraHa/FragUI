import type { SVGProps } from 'react';
import {
  BxsArchive,
  BxsCart,
  BxsCheckSquare,
  BxsHome,
  BxsInfoSquare,
  BxsPlusCircle,
  BxsXSquare,
  CloseBold,
  WarningFilled,
} from '../../../src/assets/icons';

const icons = {
  archive: BxsArchive,
  cart: BxsCart,
  checkSquare: BxsCheckSquare,
  closeBold: CloseBold,
  home: BxsHome,
  infoSquare: BxsInfoSquare,
  plusCircle: BxsPlusCircle,
  warningFilled: WarningFilled,
  xSquare: BxsXSquare,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...props }: IconProps) {
  const Component = icons[name];

  return <Component size={size} {...props} />;
}