import { useEffect, useState } from 'react';
import SidePanel from '../../ui/kit/SidePanel';
import styles from './ThemeCustomizerComponent.module.css';
import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import ThemeDetail from './ThemeDetail';
import ThemeLeftbar from './ThemeLeftbar';
import ThemePaletteSidepanel from './ThemePaletteSidepanel';
import { useSidepanelContext } from '../../ui/kit/SidepanelContext';

function ThemeCustomizerComponent() {
  const {
    activePaletteWithoutSettings,
    activePalette,
    activeTheme,
    centerColor,
    activePaletteWithoutEndSettings,
  } = useThemeCustomizerContext();
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);

  const { closeModal } = useSidepanelContext();

  useEffect(() => {
    if (!activePalette && isSidepanelOpen) {
      closeModal('palette-customizer');
    }
  }, [activePalette, closeModal, isSidepanelOpen]);

  return (
    <>
      <div className={styles.themeCustomizer}>
        <ThemeLeftbar />
        <ThemeDetail isSidepanelOpen={isSidepanelOpen} />
      </div>
      <SidePanel.BodyRelative
        id="palette-customizer"
        width="500px"
        isOpenToSync={isSidepanelOpen}
        setIsOpenToSync={setIsSidepanelOpen}
      >
        {activePalette &&
          activeTheme &&
          centerColor &&
          activePaletteWithoutEndSettings &&
          activePaletteWithoutSettings && (
            <ThemePaletteSidepanel
              activePalette={activePalette}
              activeTheme={activeTheme}
              centerColor={centerColor}
              activePaletteWithoutEndSettings={activePaletteWithoutEndSettings}
              activePaletteWithoutSettings={activePaletteWithoutSettings}
            />
          )}
      </SidePanel.BodyRelative>
    </>
  );
}

export default ThemeCustomizerComponent;
