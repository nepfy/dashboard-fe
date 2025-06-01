import IconProps from "#/components/icons/types";

const CrownIcon = ({
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
      x="0.975817"
      y="0.900622"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M8.58887 11.719C8.58887 10.6533 9.20583 10.3969 9.95899 11.1501L12.0342 13.2253C12.3467 13.5378 12.8595 13.5378 13.164 13.2253L16.0324 10.3489C16.3449 10.0364 16.8577 10.0364 17.1622 10.3489L20.0386 13.2253C20.3511 13.5378 20.8639 13.5378 21.1684 13.2253L23.2436 11.1501C23.9968 10.3969 24.6137 10.6533 24.6137 11.719V19.4029C24.6137 21.8067 23.0113 23.4091 20.6075 23.4091H12.5951C10.3837 23.4011 8.58887 21.6063 8.58887 19.3949V11.719Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrownIcon;
