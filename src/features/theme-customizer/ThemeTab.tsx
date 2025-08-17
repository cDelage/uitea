import { Theme } from "../../domain/DesignSystemDomain"
import { getRectSize } from "../../ui/UiConstants";
import styles from "./ThemeCustomizerComponent.module.css"
import { useThemeCustomizerContext } from "./ThemeCustomizerContext";


function ThemeTab({
    theme, index
}: { theme: Theme, index: number }) {
    const { name, background } = theme;
    const { activeThemeIndex, setActiveThemeIndex } = useThemeCustomizerContext();

    return (
        <div className={styles.themeTab} onClick={() => setActiveThemeIndex(index)} data-open={activeThemeIndex === index}>
            <div className="column gap-3 w-full">
                <strong>{name}</strong>
                <div className="text-color-light">{background}</div>
            </div>
            <div className="p-2">
                <div className="palette-color" style={{
                    ...getRectSize({height: "var(--uit-space-5)"}),
                    background
                }}></div>
            </div>
        </div>
    )
}

export default ThemeTab