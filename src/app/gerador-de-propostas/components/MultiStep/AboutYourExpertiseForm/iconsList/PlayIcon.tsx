import IconProps from "#/components/icons/types";

const PlayIcon = ({
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
      y="0.950427"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M10.5684 13.6163C10.5684 10.0748 13.0763 8.62459 16.145 10.3953L18.6209 11.8216L21.0967 13.2478C24.1655 15.0185 24.1655 17.919 21.0967 19.6898L18.6209 21.116L16.145 22.5422C13.0763 24.3129 10.5684 22.8627 10.5684 19.3212V16.4688V13.6163Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlayIcon;
