import { useState } from "react";
import InputText from "../../../ui/kit/InputText";
import { FONT_CATEGORIES, FONTS_EXTENSIONS } from "../../../ui/FontsConstants";
import Popover from "../../../ui/kit/Popover";
import FontCategorySelectorTab from "./FontCategorySelectorTab";
import { ButtonPrimary } from "../../../ui/kit/Buttons";
import { MdUpload } from "react-icons/md";
import { ICON_SIZE_MD } from "../../../ui/UiConstants";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { useParams } from "react-router-dom";
import { basename, extname } from "@tauri-apps/api/path";
import { usePopoverContext } from "../../../ui/kit/PopoverContext";

function FontsPopover({
  value,
  setValue,
  popoverId,
}: {
  value?: string;
  setValue?: (e: string) => void;
  popoverId: string;
}) {
  const [searchField, setSearchField] = useState("");
  const { designSystemPath } = useParams();
  const { closePopover } = usePopoverContext();

  async function selectFontAndUpload() {
    try {
      // 1. Sélectionner le fichier de police (uniquement une seule sélection grâce à multiple: false)
      const fontPath = (await open({
        multiple: false,
        directory: false,
        // filtre sur les extensions listées dans FONTS_EXTENSIONS
        filters: [
          {
            name: "Fonts",
            extensions: FONTS_EXTENSIONS,
          },
        ],
      })) as string | null;

      // Si l'utilisateur a fermé la fenêtre ou n'a rien sélectionné, on annule
      if (!fontPath) {
        console.warn("Aucun fichier de police sélectionné.");
        return;
      }

      // 3. Invoquer la commande Tauri `upload_typography`
      //    On transmet exactement les deux PathBuf que votre commande Rust attend.
      await invoke("upload_typography", {
        originalPath: fontPath,
        designSystemPath: designSystemPath,
      });

      const fullName = await basename(fontPath);
      const extension = await extname(fontPath);
      const fileNameSansExt = fullName
        .slice(0, fullName.length - extension.length)
        .replace(".", "");
      setValue?.(fileNameSansExt);
      const base64: string = await invoke("load_font_as_base64", {
        path: fontPath,
      });
      const fontName = fileNameSansExt;
      const fontFace = new FontFace(
        fontName,
        `url(data:font/${extension.replace(".", "")};base64,${base64})`
      );
      await fontFace.load();
      document.fonts.add(fontFace);

      closePopover(popoverId);
    } catch (err) {
      console.error("Erreur lors de la sélection ou de l'upload :", err);
    }
  }

  function handleSetValue(e: string){
    setValue?.(e);
    closePopover(popoverId);
  }

  return (
    <div className="column" data-disableoutside={true}>
      <div className="row p-2">
        <InputText
          value={searchField}
          className="w-full"
          placeholder="font name"
          onChange={(e) => setSearchField(e.target.value)}
        />
      </div>
      <Popover.Selector>
        {FONT_CATEGORIES.map((category, index) => (
          <FontCategorySelectorTab
            category={category}
            index={index}
            value={value}
            setValue={handleSetValue}
            searchField={searchField}
          />
        ))}
      </Popover.Selector>
      <div className="row justify-end p-2">
        <ButtonPrimary onClick={selectFontAndUpload}>
          <MdUpload size={ICON_SIZE_MD} /> Upload font
        </ButtonPrimary>
      </div>
    </div>
  );
}

export default FontsPopover;
