import IconProps from "#/components/icons/types";

const GlobeIcon = ({
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
      y="0.850817"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5525 24.4875C12.1273 24.4875 8.54004 20.9002 8.54004 16.4751C8.54004 12.0499 12.1273 8.46265 16.5525 8.46265C20.9776 8.46265 24.5649 12.0499 24.5649 16.4751C24.5649 20.9002 20.9776 24.4875 16.5525 24.4875Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3462 9.26392H14.1474C12.585 13.9432 12.585 19.007 14.1474 23.6863H13.3462"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.9551 9.26392C20.5175 13.9432 20.5175 19.007 18.9551 23.6863"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.3418 19.6802V18.8789C14.0211 20.4413 19.0849 20.4413 23.7642 18.8789V19.6802"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.3418 14.0715C14.0211 12.5091 19.0849 12.5091 23.7642 14.0715"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GlobeIcon;
