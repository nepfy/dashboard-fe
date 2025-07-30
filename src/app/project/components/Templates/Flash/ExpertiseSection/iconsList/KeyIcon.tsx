import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const KeyIcon: React.FC<IconProps> = ({
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
      d="M16.9255 19.8641L13.1517 23.63C12.8793 23.9104 12.3424 24.0787 11.9578 24.0226L10.2111 23.7822C9.63422 23.7021 9.09738 23.1572 9.00925 22.5803L8.76887 20.8336C8.71279 20.449 8.89707 19.9122 9.16148 19.6398L12.9273 15.8739C12.2863 13.7907 12.7831 11.427 14.4337 9.78447C16.7973 7.4208 20.6353 7.4208 23.007 9.78447C25.3787 12.1481 25.3787 16.0021 23.015 18.3658C21.3644 20.0083 19.0008 20.5131 16.9255 19.8641Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6777 20.418L14.5206 22.2608"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7746 15.2162C18.1108 15.2162 17.5728 14.6781 17.5728 14.0144C17.5728 13.3506 18.1108 12.8125 18.7746 12.8125C19.4384 12.8125 19.9765 13.3506 19.9765 14.0144C19.9765 14.6781 19.4384 15.2162 18.7746 15.2162Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default KeyIcon;
