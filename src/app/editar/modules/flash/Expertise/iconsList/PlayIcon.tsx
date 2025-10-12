import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const PlayIcon: React.FC<IconProps> = ({
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
      d="M10.0928 13.1171C10.0928 9.57558 12.6007 8.12532 15.6694 9.89607L18.1453 11.3223L20.6211 12.7485C23.6899 14.5193 23.6899 17.4198 20.6211 19.1905L18.1453 20.6167L15.6694 22.0429C12.6007 23.8137 10.0928 22.3634 10.0928 18.8219V15.9695V13.1171Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlayIcon;
