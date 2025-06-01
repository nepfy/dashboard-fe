import IconProps from "#/components/icons/types";

const HeartIcon = ({
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
      x="0.876208"
      y="0.900622"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M16.003 23.5035C13.6794 22.7103 8.4873 19.4011 8.4873 13.7924C8.4873 11.3166 10.4824 9.31348 12.9422 9.31348C14.4005 9.31348 15.6905 10.0186 16.4997 11.1083C17.309 10.0186 18.607 9.31348 20.0573 9.31348C22.5171 9.31348 24.5122 11.3166 24.5122 13.7924C24.5122 19.4011 19.3201 22.7103 16.9965 23.5035C16.7241 23.5997 16.2754 23.5997 16.003 23.5035Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeartIcon;
