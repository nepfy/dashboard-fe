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
      x="0.826403"
      y="0.850817"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M18.0515 10.0654C21.593 10.0654 24.4614 12.9339 24.4614 16.4754C24.4614 20.0169 21.593 22.8853 18.0515 22.8853H14.8465C11.305 22.8853 8.43652 20.0169 8.43652 16.4754C8.43652 12.9339 11.305 10.0654 14.8465 10.0654H18.0515Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0507 19.6805C16.2806 19.6805 14.8457 18.2455 14.8457 16.4755C14.8457 14.7054 16.2806 13.2705 18.0507 13.2705C19.8207 13.2705 21.2557 14.7054 21.2557 16.4755C21.2557 18.2455 19.8207 19.6805 18.0507 19.6805Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClockIcon;
