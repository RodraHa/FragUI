import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultSize = 24;

export const BxsHome: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m21.743 12.331l-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a1 1 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669"
    />
  </svg>
);

export const BxsArchive: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m21.704 5.29l-2.997-2.997A1 1 0 0 0 18 2H6a1 1 0 0 0-.707.293L2.296 5.29A1 1 0 0 0 2 5.999V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5.999a1 1 0 0 0-.296-.709M6.414 4h11.172l1 1H5.414zM17 13v1H7v-4h2v2h6v-2h2z"
    />
  </svg>
);

export const BxsCart: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.99 1.99 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921"
    />
    <circle cx="10.5" cy="19.5" r="1.5" fill="currentColor" />
    <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
  </svg>
);

export const BxsPlusCircle: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"
    />
  </svg>
);

export const BxsCheckSquare: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2m-7.933 13.481l-3.774-3.774l1.414-1.414l2.226 2.226l4.299-5.159l1.537 1.28z"
    />
  </svg>
);

export const BxsInfoSquare: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3 4v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1m8 3h2v2h-2zm0 4h2v6h-2z"
    />
  </svg>
);

export const BxsXSquare: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-4.793 9.793l-1.414 1.414L12 13.414l-2.793 2.793l-1.414-1.414L10.586 12L7.793 9.207l1.414-1.414L12 10.586l2.793-2.793l1.414 1.414L13.414 12z"
    />
  </svg>
);

export const WarningFilled: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="currentColor"
      d="m955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48M480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8zm32 352a48.01 48.01 0 0 1 0-96a48.01 48.01 0 0 1 0 96"
    />
  </svg>
);

export const CloseBold: React.FC<IconProps> = ({
  size = defaultSize,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="currentColor"
      d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
    />
  </svg>
);
