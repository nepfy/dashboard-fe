import IconProps from "./types";

const CloseIcon = ({
  width = "24",
  height = "24",
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
      d="M19.7076 18.2921C19.8005 18.385 19.8742 18.4953 19.9245 18.6167C19.9747 18.7381 20.0006 18.8682 20.0006 18.9996C20.0006 19.131 19.9747 19.2611 19.9245 19.3825C19.8742 19.5039 19.8005 19.6142 19.7076 19.7071C19.6147 19.8 19.5044 19.8737 19.383 19.924C19.2616 19.9743 19.1315 20.0001 19.0001 20.0001C18.8687 20.0001 18.7386 19.9743 18.6172 19.924C18.4958 19.8737 18.3855 19.8 18.2926 19.7071L10.0001 11.4133L1.70757 19.7071C1.51993 19.8947 1.26543 20.0001 1.00007 20.0001C0.734704 20.0001 0.480208 19.8947 0.292568 19.7071C0.104927 19.5194 -0.000488276 19.2649 -0.000488281 18.9996C-0.000488286 18.7342 0.104927 18.4797 0.292568 18.2921L8.58632 9.99958L0.292568 1.70708C0.104927 1.51944 -0.000488281 1.26494 -0.000488281 0.999579C-0.000488281 0.734215 0.104927 0.47972 0.292568 0.292079C0.480208 0.104439 0.734704 -0.000976562 1.00007 -0.000976562C1.26543 -0.000976562 1.51993 0.104439 1.70757 0.292079L10.0001 8.58583L18.2926 0.292079C18.4802 0.104439 18.7347 -0.000976568 19.0001 -0.000976562C19.2654 -0.000976557 19.5199 0.104439 19.7076 0.292079C19.8952 0.47972 20.0006 0.734215 20.0006 0.999579C20.0006 1.26494 19.8952 1.51944 19.7076 1.70708L11.4138 9.99958L19.7076 18.2921Z"
      fill={fill}
    />
  </svg>
);

export default CloseIcon;
