import React from "react";

interface IconProps {
  fill?: string;
  width?: string;
  height?: string;
  className?: string;
}

const StarIcon: React.FC<IconProps> = ({
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
      d="M19.3699 12.0424C19.5622 12.435 20.075 12.8116 20.5077 12.8837L23.0637 13.3083C24.6982 13.5808 25.0828 14.7666 23.905 15.9364L21.9179 17.9235C21.5814 18.26 21.3971 18.909 21.5012 19.3738L22.0701 21.8336C22.5188 23.7806 21.4852 24.5338 19.7625 23.5162L17.3668 22.098C16.9342 21.8416 16.221 21.8416 15.7804 22.098L13.3846 23.5162C11.67 24.5338 10.6284 23.7726 11.0771 21.8336L11.6459 19.3738C11.7501 18.909 11.5658 18.26 11.2293 17.9235L9.24221 15.9364C8.0724 14.7666 8.44898 13.5808 10.0835 13.3083L12.6395 12.8837C13.0641 12.8116 13.5769 12.435 13.7692 12.0424L15.1794 9.222C15.9486 7.69162 17.1986 7.69162 17.9597 9.222L19.3699 12.0424Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StarIcon;
