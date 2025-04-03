function ArrowRange({ color, size }: { color?: string; size?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size ?? "24px"}
      viewBox="0 -960 960 960"
      width={size ?? "24px"}
      fill={color ?? "#5f6368"}
    >
      <path d="M280-280 80-480l200-200 56 56-103 104h494L624-624l56-56 200 200-200 200-56-56 103-104H233l103 104-56 56Z" />
    </svg>
  );
}

export default ArrowRange;
