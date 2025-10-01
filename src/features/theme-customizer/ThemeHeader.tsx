import { MdClose, MdDelete } from 'react-icons/md';
import { Theme } from '../../domain/DesignSystemDomain';
import { getRectSize, ICON_SIZE_MD } from '../../ui/UiConstants';
import styles from './ThemeCustomizerComponent.module.css';
import Popover from '../../ui/kit/Popover';
import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import { useEffect, useState } from 'react';
import ColorPickerDesignSystem from '../design-system/ColorPickerDesignSystem';

function ThemeHeader({ activeTheme }: { activeTheme: Theme }) {
  const { background, name } = activeTheme;
  const { isMain, removeTheme, activeThemeIndex, updateTheme, tokenFamilies } =
    useThemeCustomizerContext();

  const [backgroundColor, setBackgroundColor] = useState(background);

  const [themeName, setThemeName] = useState(name);

  function handleSaveThemeName() {
    if (name !== themeName && activeThemeIndex && !isMain) {
      updateTheme({ ...activeTheme, name: themeName }, activeThemeIndex);
    }
  }

  function handleSaveBackground() {
    if (background !== backgroundColor && activeThemeIndex) {
      updateTheme({ ...activeTheme, background: backgroundColor }, activeThemeIndex);
    }
  }

  useEffect(() => {
    setThemeName(name);
    setBackgroundColor(background);
  }, [activeThemeIndex, name, background]);

  return (
    <Popover>
      <div className={styles.header}>
        <div className="row gap-6 align-center">
          <Popover.Toggle id="update-color">
            <div
              className="palette-color"
              style={{
                ...getRectSize({ height: 'var(--uit-space-7)' }),
                background,
              }}
            ></div>
          </Popover.Toggle>
          <Popover.Body id="update-color">
            <ColorPickerDesignSystem
              changeComplete={handleSaveBackground}
              defaultColor={backgroundColor}
              onChange={setBackgroundColor}
              tokens={tokenFamilies}
            />
          </Popover.Body>
          <h4 className="text-color-light">
            <input
              className="inherit-input"
              value={themeName}
              disabled={isMain}
              onChange={(e) => setThemeName(e.target.value)}
              onBlur={handleSaveThemeName}
            />
          </h4>
        </div>
        <div className="row gap-2">
          {!isMain && (
            <>
              <Popover.Toggle id="delete-palette" positionPayload="bottom-right">
                <button className="action-ghost-button">
                  <MdDelete size={ICON_SIZE_MD} />
                </button>
              </Popover.Toggle>
              <Popover.Body id="delete-palette" zIndex={100}>
                <Popover.Actions>
                  <Popover.Tab>
                    <MdClose size={ICON_SIZE_MD} /> Cancel
                  </Popover.Tab>
                  <Popover.Tab
                    clickEvent={() => activeThemeIndex && removeTheme(activeThemeIndex)}
                    theme="alert"
                  >
                    <MdDelete size={ICON_SIZE_MD} /> Remove theme
                  </Popover.Tab>
                </Popover.Actions>
              </Popover.Body>
            </>
          )}
        </div>
      </div>
    </Popover>
  );
}

export default ThemeHeader;
