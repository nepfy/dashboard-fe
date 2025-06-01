import IconProps from "#/components/icons/types";

const DiamondIcon = ({
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
      y="0.801013"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M12.9551 8.41284C11.593 8.41284 10.9921 9.0939 10.6235 9.92719L8.57233 14.5424C8.20376 15.3756 8.40407 16.6176 9.02103 17.2906L14.5176 23.332C15.5592 24.4698 17.2578 24.4698 18.2914 23.332L23.78 17.2826C24.3969 16.6016 24.5972 15.3676 24.2206 14.5343L22.1694 9.91918C21.8009 9.0939 21.1999 8.41284 19.8378 8.41284H12.9551Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.58984 13.1003H23.211"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DiamondIcon;
