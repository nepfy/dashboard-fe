export default function ConsultingIcon() {
  return (
    <svg
      width="166"
      height="111"
      viewBox="0 0 166 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.333252 8.5C0.333252 4.08172 3.91497 0.5 8.33325 0.5H157.667C162.085 0.5 165.667 4.08172 165.667 8.5V102.5C165.667 106.918 162.085 110.5 157.667 110.5H8.33324C3.91497 110.5 0.333252 106.918 0.333252 102.5V8.5Z"
        fill="#6945F1"
      />
      <path
        d="M0.333252 8.5C0.333252 4.08172 3.91497 0.5 8.33325 0.5H157.667C162.085 0.5 165.667 4.08172 165.667 8.5V102.5C165.667 106.918 162.085 110.5 157.667 110.5H8.33324C3.91497 110.5 0.333252 106.918 0.333252 102.5V8.5Z"
        fill="url(#paint0_linear_299_consulting)"
        fillOpacity="0.9"
      />
      <g opacity="0.5" filter="url(#filter0_d_299_consulting)">
        <rect
          x="43"
          y="15.5"
          width="80"
          height="80"
          rx="20"
          fill="url(#paint1_linear_299_consulting)"
          fillOpacity="0.9"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#filter1_d_299_consulting)">
        {/* Two people icons representing consulting/agencies */}
        <circle cx="60" cy="45" r="8" fill="white" />
        <circle cx="106" cy="45" r="8" fill="white" />
        <path d="M52 60C52 55 56 50 60 50C64 50 68 55 68 60" stroke="white" strokeWidth="2" fill="none" />
        <path d="M98 60C98 55 102 50 106 50C110 50 114 55 114 60" stroke="white" strokeWidth="2" fill="none" />
        {/* Connection line between people */}
        <path d="M68 45L98 45" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Chart/analytics icon */}
        <rect x="70" y="65" width="4" height="12" fill="white" />
        <rect x="78" y="60" width="4" height="17" fill="white" />
        <rect x="86" y="55" width="4" height="22" fill="white" />
        <rect x="94" y="62" width="4" height="15" fill="white" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_299_consulting"
          x1="0.333252"
          y1="0.5"
          x2="165.667"
          y2="110.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_299_consulting"
          x1="43"
          y1="15.5"
          x2="123"
          y2="95.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <filter
          id="filter0_d_299_consulting"
          x="39"
          y="11.5"
          width="88"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_299_consulting"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_299_consulting"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_299_consulting"
          x="40"
          y="35"
          width="86"
          height="50"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_299_consulting"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_299_consulting"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
