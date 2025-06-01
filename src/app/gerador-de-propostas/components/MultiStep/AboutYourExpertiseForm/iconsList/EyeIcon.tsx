import IconProps from "#/components/icons/types";

const EyeIcon = ({
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
      y="0.950427"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M16.2776 19.6673C14.6912 19.6673 13.4092 18.3853 13.4092 16.7989C13.4092 15.2124 14.6912 13.9304 16.2776 13.9304C17.8641 13.9304 19.1461 15.2124 19.1461 16.7989C19.1461 18.3853 17.8641 19.6673 16.2776 19.6673Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.576 18.8738C24.2971 17.7441 24.2971 15.8451 23.576 14.7154C21.7412 11.8309 19.1051 10.1643 16.2767 10.1643C13.4483 10.1643 10.8122 11.8309 8.97736 14.7154C8.25624 15.8451 8.25624 17.7441 8.97736 18.8738C10.8122 21.7583 13.4483 23.4249 16.2767 23.4249C19.1051 23.4249 21.7412 21.7583 23.576 18.8738Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EyeIcon;
