import { useState } from "react";
import InputText from "../../../ui/kit/InputText";
import { FONT_CATEGORIES } from "../../../ui/FontsConstants";
import Popover from "../../../ui/kit/Popover";
import FontCategorySelectorTab from "./FontCategorySelectorTab";

function FontsPopover({
  value,
  setValue,
}: {
  value?: string;
  setValue?: (e: string) => void;
}) {
  const [searchField, setSearchField] = useState("");

  return (
    <div className="column" data-disableoutside={true}>
      <div className="column w-full border-box">
        <div className="row p-2">
          <InputText
            value={searchField}
            className="w-full"
            placeholder="font name"
            onChange={(e) => setSearchField(e.target.value)}
          />
        </div>
      </div>
      <Popover.Selector>
        {FONT_CATEGORIES.map((category, index) => (
          <FontCategorySelectorTab
            category={category}
            index={index}
            value={value}
            setValue={setValue}
            searchField={searchField}
          />
        ))}
      </Popover.Selector>
    </div>
  );
}

export default FontsPopover;
