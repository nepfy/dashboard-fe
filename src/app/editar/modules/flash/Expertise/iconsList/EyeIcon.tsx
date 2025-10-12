import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const EyeIcon: React.FC<IconProps> = ({
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
      d="M16.6482 19.1158C15.0618 19.1158 13.7798 17.8338 13.7798 16.2474C13.7798 14.6609 15.0618 13.3789 16.6482 13.3789C18.2347 13.3789 19.5167 14.6609 19.5167 16.2474C19.5167 17.8338 18.2347 19.1158 16.6482 19.1158Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9471 18.3228C24.6682 17.193 24.6682 15.2941 23.9471 14.1643C22.1123 11.2799 19.4762 9.61328 16.6478 9.61328C13.8194 9.61328 11.1833 11.2799 9.34846 14.1643C8.62734 15.2941 8.62734 17.193 9.34846 18.3228C11.1833 21.2073 13.8194 22.8739 16.6478 22.8739C19.4762 22.8739 22.1123 21.2073 23.9471 18.3228Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EyeIcon;
