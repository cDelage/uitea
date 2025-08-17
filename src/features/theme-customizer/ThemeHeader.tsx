import { Theme } from "../../domain/DesignSystemDomain"
import { getRectSize } from "../../ui/UiConstants"
import styles from "./ThemeCustomizerComponent.module.css"

function ThemeHeader({ activeTheme: { name, background } }: { activeTheme: Theme }) {

    return (
        <div className={styles.header}>
            <div className="row gap-6 align-center">
                <div className="palette-color" style={{
                    ...getRectSize({ height: "var(--uit-space-7)" }),
                    background
                }}></div>
                <h4 className="text-color-light">
                    <input className="inherit-input" value={name} />
                </h4>
            </div>
            <div className="row gap-2">

            </div>
        </div>
    )
}

export default ThemeHeader