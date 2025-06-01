import IconProps from "#/components/icons/types";

const KeyIcon = ({
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
      y="0.950427"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M16.5554 20.4144L12.7816 24.1803C12.5091 24.4607 11.9723 24.629 11.5877 24.5729L9.841 24.3325C9.2641 24.2524 8.72727 23.7075 8.63913 23.1306L8.39876 21.3839C8.34267 20.9993 8.52696 20.4625 8.79137 20.1901L12.5572 16.4242C11.9162 14.341 12.413 11.9773 14.0636 10.3348C16.4272 7.97109 20.2652 7.97109 22.6369 10.3348C25.0085 12.6984 25.0085 16.5524 22.6449 18.9161C20.9943 20.5586 18.6306 21.0634 16.5554 20.4144Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3076 20.9675L14.1505 22.8104"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.404 15.7673C17.7402 15.7673 17.2021 15.2292 17.2021 14.5654C17.2021 13.9016 17.7402 13.3635 18.404 13.3635C19.0678 13.3635 19.6059 13.9016 19.6059 14.5654C19.6059 15.2292 19.0678 15.7673 18.404 15.7673Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default KeyIcon;
