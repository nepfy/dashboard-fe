import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const ClockIcon: React.FC<IconProps> = ({
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
      d="M16.1726 24.0366C11.7497 24.0366 8.16016 20.447 8.16016 16.0242C8.16016 11.6013 11.7497 8.01172 16.1726 8.01172C20.5955 8.01172 24.185 11.6013 24.185 16.0242C24.185 20.447 20.5955 24.0366 16.1726 24.0366Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.147 18.5713L16.6631 17.089C16.2305 16.8326 15.8779 16.2157 15.8779 15.7109V12.4258"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClockIcon;
