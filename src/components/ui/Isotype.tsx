import React from 'react';

export interface IsotypeProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

/**
 * Isotipo oficial de Alviestetic para sustituir la letra A inicial
 * en barra lateral, cabecera móvil, pantalla de acceso y favicon.
 */
export const Isotype: React.FC<IsotypeProps> = ({
  className = '',
  size,
  width,
  height,
  color,
  style,
  viewBox = '0 0 82 71',
  ...props
}) => {
  const computedWidth = width || size;
  const computedHeight = height || size;

  return (
    <svg
      width={computedWidth}
      height={computedHeight}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color, ...style }}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M49.56 69.97V69.92L81.09 23.52L59.11 43.54L69.16 15.81L51.74 42.86L54.36 10.27L54.38 10.07L45.64 40.05L40.4 0L35.36 39.77L26.7 10.09L29.34 42.88L11.93 15.83L21.97 43.56L0 23.55L31.51 69.95L31.52 70.06L31.57 70.05L31.64 70.26L31.76 70.59L32.26 70.08L32.38 70.1L32.4 69.94L37.17 65.05L40.55 61.6L48.68 69.92L48.7 70.08L48.82 70.07L49.2 70.45L49.31 70.57L49.51 70.03H49.55L49.56 69.97Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Isotype;
