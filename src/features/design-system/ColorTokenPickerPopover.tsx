import { useState } from "react";
import { useDesignSystemContext } from "./DesignSystemContext";
import styles from "./InputPopover.module.css";
import Tabs from "./Tabs";
import InputText from "../../ui/kit/InputText";
import ColorPickerOld from "./ColorPickerOld";

function ColorTokenPickerPopover({
  value,
  setValue,
}: {
  value?: string;
  setValue?: (e: string) => void;
}) {
  const { colorTokens } = useDesignSystemContext();

  const [searchField, setSearchField] = useState("");

  const filteredTokens = searchField
    ? colorTokens?.filter(
        (token) =>
          token.label.includes(searchField) || token.value.includes(searchField)
      )
    : colorTokens;

  return (
    <div className={styles.inputPopover}>
      <Tabs defaultTab="tokens">
        <div className={styles.tabsContainer}>
          <Tabs.Tab id="tokens">
            <button className={styles.tab}>Tokens</button>
          </Tabs.Tab>
          <Tabs.Tab id="picker">
            <button className={styles.tab}>Picker</button>
          </Tabs.Tab>
        </div>
        <Tabs.TabBody id="tokens">
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
            {filteredTokens?.map((token) => (
              <div
                className={styles.selectionTab}
                key={token.label}
                onClick={() => setValue?.(token.label)}
                data-active={value && value === token.label}
              >
                <div
                  className={styles.colorPreviewContainer}
                  style={{ background: token.value }}
                />
                <div className="column gap-1">
                  <strong>{token.label}</strong>
                  <div>{token.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Tabs.TabBody>
        <Tabs.TabBody id="picker">
          <div>
            <ColorPickerOld 
              color={value}
              setColor={setValue}
            />
          </div>
        </Tabs.TabBody>
      </Tabs>
    </div>
  );
}

export default ColorTokenPickerPopover;
