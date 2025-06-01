import IconProps from "#/components/icons/types";

const ClockIcon = ({
  width = "32",
  height = "32",
  fill = "#1C1A22",
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.926013"
      y="0.801013"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M16.5486 24.4377C12.1257 24.4377 8.53613 20.8481 8.53613 16.4253C8.53613 12.0024 12.1257 8.41284 16.5486 8.41284C20.9714 8.41284 24.561 12.0024 24.561 16.4253C24.561 20.8481 20.9714 24.4377 16.5486 24.4377Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.523 18.9732L17.0391 17.4909C16.6065 17.2345 16.2539 16.6175 16.2539 16.1127V12.8276"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClockIcon;
