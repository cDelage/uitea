import ThemeArray from "./ThemeArray";
import { useThemeCustomizerContext } from "./ThemeCustomizerContext"
import ThemeHeader from "./ThemeHeader";
function ThemeDetail({ isSidepanelOpen }: { isSidepanelOpen: boolean }) {
    const { activeTheme } = useThemeCustomizerContext();

    return (
        <div className="column w-full" style={{
            paddingRight: isSidepanelOpen ? "500px" : ""
        }}>
            {activeTheme && <>
                <ThemeHeader activeTheme={activeTheme} />
                <ThemeArray activeTheme={activeTheme} />
            </>}

        </div>
    )
}

export default ThemeDetail