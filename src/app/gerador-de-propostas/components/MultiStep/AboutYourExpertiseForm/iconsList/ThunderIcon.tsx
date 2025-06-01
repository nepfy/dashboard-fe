import IconProps from "#/components/icons/types";

const ThunderIcon = ({
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
      y="0.850817"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M14.2946 17.2076V22.9766C14.2946 23.8259 15.3522 24.2265 15.9131 23.5855L21.9785 16.6948C22.5073 16.0939 22.0826 15.1564 21.2814 15.1564H18.8056V9.38748C18.8056 8.53816 17.7479 8.13754 17.187 8.77853L11.1216 15.6692C10.6008 16.2702 11.0255 17.2076 11.8187 17.2076H14.2946Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ThunderIcon;
