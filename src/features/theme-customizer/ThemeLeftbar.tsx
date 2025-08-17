import { useNavigate } from "react-router-dom";
import { ButtonTertiary } from "../../ui/kit/Buttons";
import styles from "./ThemeCustomizerComponent.module.css";
import { useThemeCustomizerContext } from "./ThemeCustomizerContext";
import ThemeTab from "./ThemeTab";
import { MdChevronLeft } from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";

function ThemeLeftbar() {
    const { designSystem: { themes, metadata: { designSystemPath } }, } = useThemeCustomizerContext();
    const navigate = useNavigate();
    return <div className={styles.themeSelector}>
        <div className={styles.sidePanelBloc}>
            <ButtonTertiary
                onClick={() =>
                    navigate(
                        `/design-system/${encodeURIComponent(
                            designSystemPath
                        )}?editMode=true&scrollComponent=Themes`
                    )
                }
            >
                <MdChevronLeft size={ICON_SIZE_MD} /> Back to design
                system
            </ButtonTertiary>
        </div>
        {
            themes.mainTheme &&
            <ThemeTab theme={themes.mainTheme} index={0} />
        }
        {
            themes.otherThemes.map((theme, index) => <ThemeTab key={theme.name} index={index + 1} theme={theme} />)
        }
    </div>
}

export default ThemeLeftbar