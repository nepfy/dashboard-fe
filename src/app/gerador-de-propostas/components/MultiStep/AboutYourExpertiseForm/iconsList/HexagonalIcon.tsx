import IconProps from "#/components/icons/types";

const HexagonalIcon = ({
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
      y="0.850817"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M9.1875 18.6945C9.1875 20.3932 9.1875 20.3932 10.79 21.4748L15.1968 24.0228C15.8619 24.4074 16.9435 24.4074 17.6006 24.0228L22.0074 21.4748C23.6099 20.3932 23.6099 20.3932 23.6099 18.7025V14.0714C23.6099 12.3807 23.6099 12.3807 22.0074 11.2991L17.6006 8.75109C16.9435 8.3665 15.8619 8.3665 15.1968 8.75109L10.79 11.2991C9.1875 12.3807 9.1875 12.3807 9.1875 14.0714V18.6945Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.3998 18.7904C15.0723 18.7904 13.9961 17.7142 13.9961 16.3866C13.9961 15.0591 15.0723 13.9829 16.3998 13.9829C17.7274 13.9829 18.8036 15.0591 18.8036 16.3866C18.8036 17.7142 17.7274 18.7904 16.3998 18.7904Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HexagonalIcon;
