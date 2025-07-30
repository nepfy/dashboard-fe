import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const BulbIcon: React.FC<IconProps> = ({
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
      d="M13.4681 19.9375C11.6252 18.8238 10.1108 16.6524 10.1108 14.3448C10.1108 10.3787 13.7565 7.26983 17.8749 8.16723C19.6857 8.56785 21.2722 9.76971 22.0974 11.4283C23.772 14.7935 22.0093 18.3671 19.4213 19.9295V20.8589C19.4213 21.0913 19.5094 21.6281 18.6521 21.6281H14.2372C13.3559 21.6361 13.4681 21.2916 13.4681 20.8669V19.9375Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.6304 24.039C15.4652 23.5182 17.4042 23.5182 19.2391 24.039"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BulbIcon;
