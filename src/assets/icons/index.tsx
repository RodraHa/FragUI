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
