import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const CubeIcon: React.FC<IconProps> = ({
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
      d="M8.73486 12.4219L15.8098 16.5162L22.8368 12.4459"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8105 23.7751V16.5078"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.87406 10.8198C8.90456 11.3566 8.11133 12.7027 8.11133 13.8084V18.3355C8.11133 19.4412 8.90456 20.7873 9.87406 21.3241L14.1527 23.7038C15.0661 24.2086 16.5645 24.2086 17.4779 23.7038L21.7565 21.3241C22.726 20.7873 23.5193 19.4412 23.5193 18.3355V13.8084C23.5193 12.7027 22.726 11.3566 21.7565 10.8198L17.4779 8.44009C16.5564 7.93531 15.0661 7.93531 14.1527 8.4481L9.87406 10.8198Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CubeIcon;
