import { useState } from "react";
import styles from "./InputPopover.module.css";
import { WEB_SAFE_FONTS } from "../../ui/UiConstants";
import InputText from "../../ui/kit/InputText";

function FontsPopover({
  value,
  setValue,
}: {
  value?: string;
  setValue?: (e: string) => void;
}) {
  const [searchField, setSearchField] = useState("");

  const filteredFonts = searchField
    ? WEB_SAFE_FONTS?.filter((font) => font.includes(searchField))
    : WEB_SAFE_FONTS;

  return (
    <div className={styles.inputPopover}>
      <div className="column w-full border-box">
        <div className="row p-3">
          <InputText
            value={searchField}
            className="w-full"
            onChange={(e) => setSearchField(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.keyValueMenuContainer}>
        {filteredFonts?.map((font) => (
          <div
            className={styles.selectionTab}
            key={font}
            onClick={() => setValue?.(font)}
            data-active={value && value === font}
            style={{
              fontFamily: font,
            }}
          >
            <div className="column gap-1">
              <strong>{font}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FontsPopover;
