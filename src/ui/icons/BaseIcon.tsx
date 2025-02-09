import { Base } from "../../domain/DesignSystemDomain";

function BaseIcon({ base, size}: { base: Base, size: string }) {
    
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="16" height="12" fill={base.background.default} />
      <path
        d="M6 16H13V13H6V16ZM15 16H18V8H15V16ZM6 11H13V8H6V11ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H20V6H4V18Z"
        fill={base.border.default}
      />
      <rect x="6" y="8" width="7" height="3" fill={base.textLight.default} />
      <rect x="6" y="13" width="7" height="3" fill={base.textDefault.default} />
      <rect x="15" y="8" width="3" height="8" fill={base.textDark.default} />
    </svg>
  );
}

export default BaseIcon;
