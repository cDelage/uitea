function FontIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_i_154_5631)">
        <rect width="32" height="32" rx="4" fill="#FAFAFA" />
        <path
          d="M14.9089 26.9091V20.3636H17.0907V22.5455H25.818V24.7273H17.0907V26.9091H14.9089ZM6.18164 24.7273V22.5455H12.7271V24.7273H6.18164ZM9.918 18.1818H12.1816L13.3816 14.8273H18.6453L19.818 18.1818H22.0816L17.1726 5.09091H14.8271L9.918 18.1818ZM14.0362 12.9455L15.9453 7.51818H16.0544L17.9635 12.9455H14.0362Z"
          fill="#525252"
        />
        <path
          d="M6.18164 24.7273V22.5454H12.7271V24.7273H6.18164Z"
          fill="#171717"
        />
        <path
          d="M14.9087 26.9091V20.3636H17.0905V22.5454H25.8178V24.7273H17.0905V26.9091H14.9087Z"
          fill="#60A5FA"
        />
        <path
          d="M17.0815 24.7273V22.5454H25.8251L25.8254 24.7273H17.0815Z"
          fill="#171717"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_154_5631"
          x="0"
          y="0"
          width="32"
          height="34.9091"
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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.90909" />
          <feGaussianBlur stdDeviation="2.90909" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_154_5631"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default FontIcon;
