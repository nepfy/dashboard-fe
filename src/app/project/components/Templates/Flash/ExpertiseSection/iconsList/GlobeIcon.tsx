import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const GlobeIcon: React.FC<IconProps> = ({
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
      d="M16.425 24.0366C11.9999 24.0366 8.4126 20.4493 8.4126 16.0242C8.4126 11.599 11.9999 8.01172 16.425 8.01172C20.8502 8.01172 24.4375 11.599 24.4375 16.0242C24.4375 20.4493 20.8502 24.0366 16.425 24.0366Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.2187 8.8125H14.02C12.4575 13.4918 12.4575 18.5556 14.02 23.2349H13.2187"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.8276 8.8125C20.3901 13.4918 20.3901 18.5556 18.8276 23.2349"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.21387 19.2309V18.4297C13.8931 19.9921 18.957 19.9921 23.6363 18.4297V19.2309"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.21387 13.621C13.8931 12.0586 18.957 12.0586 23.6363 13.621"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GlobeIcon;
