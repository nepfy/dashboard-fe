import IconProps from "#/components/icons/types";

const BulbIcon = ({
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
      x="0.776599"
      y="0.900622"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M13.3465 20.438C11.5036 19.3243 9.98926 17.1529 9.98926 14.8453C9.98926 10.8791 13.6349 7.77032 17.7533 8.66771C19.5641 9.06834 21.1506 10.2702 21.9759 11.9288C23.6505 15.294 21.8877 18.8676 19.2997 20.43V21.3594C19.2997 21.5918 19.3879 22.1286 18.5305 22.1286H14.1157C13.2343 22.1366 13.3465 21.7921 13.3465 21.3674V20.438Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5088 24.5403C15.3436 24.0195 17.2826 24.0195 19.1175 24.5403"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BulbIcon;
