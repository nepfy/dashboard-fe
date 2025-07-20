import IconProps from "#/components/icons/types";

const CircleIcon = ({
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
      y="0.801013"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke={fill}
      strokeWidth="0.801244"
    />
    <path
      d="M8.75879 18.8052C9.61612 21.5615 11.9237 23.6848 14.7922 24.2697"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.43848 15.608C8.84711 11.5617 12.2604 8.41284 16.4109 8.41284C20.5613 8.41284 23.9746 11.5697 24.3832 15.608"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0225 24.2776C20.8829 23.6927 23.1825 21.5935 24.0558 18.8452"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CircleIcon;
