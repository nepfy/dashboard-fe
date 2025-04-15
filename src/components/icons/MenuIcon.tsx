import IconProps from "./types";

const MenuIcon = ({
  width = "24",
  height = "24",
  fill = "#1C1A22",
  className,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
      fill={fill}
    />
  </svg>
);

export default MenuIcon;
