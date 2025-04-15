import IconProps from "./types";

const HelpIcon = ({
  width = "32",
  height = "32",
  fill = "#1C1A22",
  className,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.8907 2.49348C7.87647 2.08516 8.93301 1.875 10 1.875C11.067 1.875 12.1235 2.08516 13.1093 2.49348C14.0951 2.9018 14.9908 3.50028 15.7452 4.25476C16.4997 5.00923 17.0982 5.90493 17.5065 6.8907C17.9148 7.87647 18.125 8.93301 18.125 10C18.125 11.067 17.9148 12.1235 17.5065 13.1093C17.0982 14.0951 16.4997 14.9908 15.7452 15.7452C14.9908 16.4997 14.0951 17.0982 13.1093 17.5065C12.1235 17.9148 11.067 18.125 10 18.125C8.93301 18.125 7.87647 17.9148 6.8907 17.5065C5.90493 17.0982 5.00923 16.4997 4.25476 15.7452C3.50028 14.9908 2.9018 14.0951 2.49348 13.1093C2.08516 12.1235 1.875 11.067 1.875 10C1.875 8.93301 2.08516 7.87647 2.49348 6.8907C2.9018 5.90493 3.50028 5.00923 4.25476 4.25476C5.00923 3.50028 5.90493 2.9018 6.8907 2.49348ZM10 3.125C9.09716 3.125 8.20317 3.30283 7.36905 3.64833C6.53494 3.99383 5.77704 4.50024 5.13864 5.13864C4.50024 5.77704 3.99383 6.53494 3.64833 7.36905C3.30283 8.20317 3.125 9.09716 3.125 10C3.125 10.9028 3.30283 11.7968 3.64833 12.6309C3.99383 13.4651 4.50024 14.223 5.13864 14.8614C5.77704 15.4998 6.53494 16.0062 7.36905 16.3517C8.20317 16.6972 9.09716 16.875 10 16.875C10.9028 16.875 11.7968 16.6972 12.6309 16.3517C13.4651 16.0062 14.223 15.4998 14.8614 14.8614C15.4998 14.223 16.0062 13.4651 16.3517 12.6309C16.6972 11.7968 16.875 10.9028 16.875 10C16.875 9.09716 16.6972 8.20317 16.3517 7.36905C16.0062 6.53494 15.4998 5.77704 14.8614 5.13864C14.223 4.50024 13.4651 3.99383 12.6309 3.64833C11.7968 3.30283 10.9028 3.125 10 3.125ZM10 13.5417C10.3452 13.5417 10.625 13.8215 10.625 14.1667V14.175C10.625 14.5202 10.3452 14.8 10 14.8C9.65482 14.8 9.375 14.5202 9.375 14.175V14.1667C9.375 13.8215 9.65482 13.5417 10 13.5417Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.82103 5.47412C9.2083 5.2825 9.63476 5.18338 10.0668 5.18458C10.4989 5.18578 10.9248 5.28726 11.311 5.48103C11.6972 5.6748 12.0332 5.95557 12.2924 6.30124C12.5517 6.6469 12.7272 7.04803 12.805 7.47304C12.8829 7.89805 12.8611 8.33533 12.7413 8.75047C12.6214 9.1656 12.4069 9.54725 12.1145 9.86538C11.8221 10.1835 11.4598 10.4294 11.0562 10.5837C11.051 10.5858 11.0457 10.5877 11.0403 10.5896C10.9125 10.6345 10.8028 10.7198 10.7276 10.8325C10.6525 10.9452 10.616 11.0793 10.6237 11.2146C10.6432 11.5592 10.3797 11.8544 10.0351 11.874C9.69044 11.8935 9.39522 11.63 9.37568 11.2854C9.35266 10.8796 9.46212 10.4773 9.68757 10.1391C9.91117 9.80374 10.2368 9.54941 10.6162 9.41372C10.8365 9.32834 11.0342 9.19347 11.1942 9.01949C11.3556 8.84381 11.4741 8.63305 11.5403 8.4038C11.6065 8.17454 11.6185 7.93306 11.5755 7.69835C11.5325 7.46365 11.4356 7.24213 11.2924 7.05124C11.1493 6.86035 10.9637 6.70529 10.7505 6.59829C10.5372 6.49128 10.302 6.43524 10.0634 6.43458C9.82477 6.43391 9.58926 6.48865 9.37539 6.59447C9.16153 6.70029 8.97514 6.85432 8.83092 7.04441C8.62228 7.3194 8.23023 7.37319 7.95524 7.16455C7.68025 6.95592 7.62646 6.56386 7.8351 6.28887C8.09626 5.94465 8.43376 5.66575 8.82103 5.47412Z"
      fill={fill}
    />
  </svg>
);

export default HelpIcon;
