import IconProps from "#/components/icons/types";

const BubblesIcon = ({
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
      x="0.876208"
      y="0.801013"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.1534 16.6336C16.8833 16.6336 15.043 14.7933 15.043 12.5232C15.043 10.2531 16.8833 8.41284 19.1534 8.41284C21.4235 8.41284 23.2637 10.2531 23.2637 12.5232C23.2637 14.7933 21.4235 16.6336 19.1534 16.6336Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7569 22.3871C10.3939 22.3871 9.28906 21.2822 9.28906 19.9192C9.28906 18.5563 10.3939 17.4514 11.7569 17.4514C13.1198 17.4514 14.2247 18.5563 14.2247 19.9192C14.2247 21.2822 13.1198 22.3871 11.7569 22.3871Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.9779 24.4378C18.8451 24.4378 17.9268 23.5195 17.9268 22.3866C17.9268 21.2538 18.8451 20.3354 19.9779 20.3354C21.1108 20.3354 22.0291 21.2538 22.0291 22.3866C22.0291 23.5195 21.1108 24.4378 19.9779 24.4378Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
  </svg>
);

export default BubblesIcon;
