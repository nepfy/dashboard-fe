import IconProps from "#/components/icons/types";

const StarIcon = ({
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
      y="0.900622"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M19.2484 12.5424C19.4407 12.935 19.9535 13.3116 20.3861 13.3837L22.9421 13.8083C24.5766 14.0808 24.9612 15.2666 23.7834 16.4364L21.7963 18.4235C21.4598 18.76 21.2755 19.409 21.3797 19.8738L21.9485 22.3336C22.3972 24.2806 21.3636 25.0338 19.641 24.0162L17.2452 22.598C16.8126 22.3416 16.0995 22.3416 15.6588 22.598L13.2631 24.0162C11.5484 25.0338 10.5068 24.2726 10.9555 22.3336L11.5244 19.8738C11.6285 19.409 11.4442 18.76 11.1077 18.4235L9.12063 16.4364C7.95082 15.2666 8.3274 14.0808 9.96194 13.8083L12.5179 13.3837C12.9426 13.3116 13.4554 12.935 13.6477 12.5424L15.0579 9.722C15.827 8.19162 17.077 8.19162 17.8382 9.722L19.2484 12.5424Z"
      stroke={fill}
      strokeWidth="1.20187"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StarIcon;
