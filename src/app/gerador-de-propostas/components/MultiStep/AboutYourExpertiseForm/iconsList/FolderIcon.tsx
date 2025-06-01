import IconProps from "#/components/icons/types";

const FolderIcon = ({
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
      y="0.950427"
      width="31.2485"
      height="31.2485"
      rx="6.00933"
      stroke="#E0E3E9"
      strokeWidth="0.801244"
    />
    <path
      d="M24.5141 20.5807C24.5141 23.7856 23.7129 24.5869 20.5079 24.5869H12.4955C9.2905 24.5869 8.48926 23.7856 8.48926 20.5807V12.5682C8.48926 9.36326 9.2905 8.56201 12.4955 8.56201H13.6973C14.8992 8.56201 15.1636 8.91456 15.6203 9.5235L16.8222 11.126C17.1267 11.5266 17.3029 11.767 18.1042 11.767H20.5079C23.7129 11.767 24.5141 12.5682 24.5141 15.7732V20.5807Z"
      stroke={fill}
      strokeWidth="1.20187"
    />
  </svg>
);

export default FolderIcon;
