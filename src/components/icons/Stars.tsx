import IconProps from "./types";

const Stars = ({
  width = "179",
  height = "146",
  fill,
  className,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 179 146"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g opacity="0.45" filter="url(#filter0_f_27135_133573)">
      <path
        d="M96.5 -42.7246L94.8896 0.585122C93.9044 27.0819 72.5746 48.3317 45.9913 49.3002L1.272 50.9294L45.9913 52.5586C72.5746 53.527 93.9044 74.7769 94.8897 101.274L96.5 144.583L98.1104 101.274C99.0956 74.7769 120.425 53.527 147.009 52.5586L191.728 50.9294L147.009 49.3002C120.425 48.3317 99.0956 27.0819 98.1104 0.585129L96.5 -42.7246Z"
        fill="#B5A3FA"
      />
      <path
        d="M153.947 71.0214L153.308 88.127C152.918 98.5921 144.456 106.985 133.911 107.367L116.171 108.011L133.911 108.654C144.456 109.037 152.918 117.43 153.308 127.895L153.947 145L154.586 127.895C154.977 117.43 163.438 109.037 173.984 108.654L191.724 108.011L173.984 107.367C163.438 106.985 154.977 98.5921 154.586 88.127L153.947 71.0214Z"
        fill="#5B32F4"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_27135_133573"
        x="0.271973"
        y="-43.7246"
        width="192.456"
        height="189.725"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="0.5"
          result="effect1_foregroundBlur_27135_133573"
        />
      </filter>
    </defs>
  </svg>
);

export default Stars;
