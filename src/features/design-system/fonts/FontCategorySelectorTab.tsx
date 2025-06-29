import { useMemo } from "react";
import { FONT_ARRAY, FontCategoryAndFont } from "../../../ui/FontsConstants";
import Popover from "../../../ui/kit/Popover";
import FontDisplay from "./FontDisplay";

function FontCategorySelectorTab({
  category,
  index,
  value,
  setValue,
  searchField,
}: {
  category: FontCategoryAndFont;
  index: number;
  value?: string;
  setValue?: (e: string) => void;
  searchField: string;
}) {
  const fonts = useMemo(
    () =>
      FONT_ARRAY.filter(
        (font) =>
          font.category === category.category &&
          (!searchField ||
            font.name.toLowerCase().includes(searchField.toLowerCase()))
      ),
    [category, searchField]
  );

  return (
    <Popover.SelectorTab
      id={index}
      key={category.category}
      childWidth="300px"
      selectNode={
        <>
          {fonts.map((font) => (
            <Popover.Tab
              key={font.name}
              width="300px"
              theme={value === font.name ? "primary" : undefined}
              clickEvent={() => setValue?.(font.name)}
              disableClose={true}
            >
              <div className="column w-full gap-3">
                <FontDisplay
                  display={font.name}
                  font={font.name}
                  fontSize="24px"
                  lineHeight="32px"
                />
                <small
                  className={
                    font.variable ? "text-color-primary" : "text-color-light"
                  }
                >
                  {font.variable ? "VARIABLE" : " "}
                </small>
              </div>
            </Popover.Tab>
          ))}
        </>
      }
    >
      <div className="column w-full gap-2">
        <FontDisplay
          display={category.category}
          font={category.mainFont}
          fontSize="24px"
          lineHeight="28px"
        ></FontDisplay>
        <small
          className={
            searchField && fonts.length
              ? "text-color-primary"
              : "text-color-light"
          }
        >
          {fonts.length} fonts
        </small>
      </div>
    </Popover.SelectorTab>
  );
}

export default FontCategorySelectorTab;
