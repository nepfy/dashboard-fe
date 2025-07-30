import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const BubblesIcon: React.FC<IconProps> = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7769 16.2325C16.5068 16.2325 14.6665 14.3922 14.6665 12.1221C14.6665 9.852 16.5068 8.01172 18.7769 8.01172C21.047 8.01172 22.8873 9.852 22.8873 12.1221C22.8873 14.3922 21.047 16.2325 18.7769 16.2325Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.3809 21.9864C10.018 21.9864 8.91309 20.8816 8.91309 19.5186C8.91309 18.1557 10.018 17.0508 11.3809 17.0508C12.7439 17.0508 13.8488 18.1557 13.8488 19.5186C13.8488 20.8816 12.7439 21.9864 11.3809 21.9864Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.602 24.036C18.4691 24.036 17.5508 23.1176 17.5508 21.9848C17.5508 20.8519 18.4691 19.9336 19.602 19.9336C20.7348 19.9336 21.6531 20.8519 21.6531 21.9848C21.6531 23.1176 20.7348 24.036 19.602 24.036Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
  </svg>
);

export default BubblesIcon;
