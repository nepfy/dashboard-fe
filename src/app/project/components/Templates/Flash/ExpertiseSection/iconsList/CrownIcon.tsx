import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const CrownIcon: React.FC<IconProps> = ({
  fill = "black",
  width = "33",
  height = "33",
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.70996 11.2178C8.70996 10.1521 9.32692 9.89572 10.0801 10.6489L12.1553 12.7241C12.4678 13.0366 12.9806 13.0366 13.2851 12.7241L16.1535 9.84765C16.466 9.53516 16.9788 9.53516 17.2833 9.84765L20.1597 12.7241C20.4722 13.0366 20.985 13.0366 21.2895 12.7241L23.3647 10.6489C24.1179 9.89572 24.7348 10.1521 24.7348 11.2178V18.9017C24.7348 21.3054 23.1324 22.9079 20.7286 22.9079H12.7162C10.5047 22.8999 8.70996 21.1051 8.70996 18.8937V11.2178Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrownIcon;
