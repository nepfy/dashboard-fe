export default function Gradient() {
  return (
    <svg
      className="lg:w-[720px] lg:h-[720px] 2xl:w-[1000px] 2xl:h-[1000px]"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_2131_32)">
        <rect
          x="94.7"
          y="94.7"
          width="810.6"
          height="810.6"
          rx="405.3"
          fill="black"
        />
        <rect
          x="94.7"
          y="94.7"
          width="810.6"
          height="810.6"
          rx="405.3"
          fill="url(#paint0_radial_2131_32)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_2131_32"
          x="0"
          y="0"
          width="1000"
          height="1000"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="47.35"
            result="effect1_foregroundBlur_2131_32"
          />
        </filter>
        <radialGradient
          id="paint0_radial_2131_32"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(158.249 305.824) rotate(29.7859) scale(978.102 2391.42)"
        >
          <stop />
          <stop offset="0.342151" stopColor="#200D42" />
          <stop offset="0.649006" stopColor="#4F21A1" />
          <stop offset="0.817781" stopColor="#A46EDB" />
        </radialGradient>
      </defs>
    </svg>
  );
}
