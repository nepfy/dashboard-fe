import IconProps from "./types";

const Logo = ({
  width = "23",
  height = "28",
  fill = "#FAFAFB",
  className,
}: IconProps) => (
  <span className={className}>
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.55556 21.4821C1.13889 21.4821 0 20.3432 0 18.9821C0 17.5932 1.13889 16.4543 2.55556 16.4543C3.91667 16.4543 5.11111 17.5932 5.11111 18.9821C5.11111 20.3432 3.91667 21.4821 2.55556 21.4821Z"
        fill={fill}
      />
      <path
        d="M11.2182 20.9444H6.94043V7.05553H10.9682L11.246 8.49997C12.1071 7.30553 13.6904 6.61108 15.496 6.61108C18.8015 6.61108 20.7182 8.7222 20.7182 12.3611V20.9444H16.4404V13.3889C16.4404 11.6389 15.4682 10.5 13.996 10.5C12.3015 10.5 11.2182 11.6111 11.2182 13.3333V20.9444Z"
        fill={fill}
      />
    </svg>
  </span>
);

export default Logo;
