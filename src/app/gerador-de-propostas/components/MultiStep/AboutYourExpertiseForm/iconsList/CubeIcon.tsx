import IconProps from "#/components/icons/types";

const CubeIcon = ({
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
      y="0.950427"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M9.21094 12.9214L16.2859 17.0157L23.3128 12.9454"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.2861 24.2751V17.0078"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3497 11.3193C9.38015 11.8561 8.58691 13.2022 8.58691 14.3079V18.835C8.58691 19.9407 9.38015 21.2868 10.3497 21.8236L14.6283 24.2033C15.5417 24.7081 17.04 24.7081 17.9535 24.2033L22.2321 21.8236C23.2016 21.2868 23.9948 19.9407 23.9948 18.835V14.3079C23.9948 13.2022 23.2016 11.8561 22.2321 11.3193L17.9535 8.9396C17.032 8.43482 15.5417 8.43482 14.6283 8.94762L10.3497 11.3193Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CubeIcon;
