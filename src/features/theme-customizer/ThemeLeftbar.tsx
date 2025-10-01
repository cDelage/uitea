import { useNavigate } from 'react-router-dom';
import { ButtonTertiary } from '../../ui/kit/Buttons';
import styles from './ThemeCustomizerComponent.module.css';
import { useThemeCustomizerContext } from './ThemeCustomizerContext';
import ThemeTab from './ThemeTab';
import { MdAdd, MdChevronLeft } from 'react-icons/md';
import { ICON_SIZE_MD } from '../../ui/UiConstants';
import Popover from '../../ui/kit/Popover';
import ColorPickerDesignSystem from '../design-system/ColorPickerDesignSystem';

function ThemeLeftbar() {
  const {
    designSystem: {
      themes,
      metadata: { designSystemPath },
    },
    createTheme,
    tokenFamilies,
  } = useThemeCustomizerContext();
  const navigate = useNavigate();
  return (
    <div className={styles.themeSelector}>
      <div className={styles.sidePanelBloc}>
        <ButtonTertiary
          onClick={() =>
            navigate(
              `/design-system/${encodeURIComponent(
                designSystemPath,
              )}?editMode=true&scrollComponent=Themes`,
            )
          }
        >
          <MdChevronLeft size={ICON_SIZE_MD} /> Back to design system
        </ButtonTertiary>
      </div>
      {themes.mainTheme && <ThemeTab theme={themes.mainTheme} index={0} />}
      {themes.otherThemes.map((theme, index) => (
        <ThemeTab key={`${theme.name}${index}`} index={index + 1} theme={theme} />
      ))}
      <Popover>
        <div className={styles.sidePanelBloc}>
          <Popover.Toggle id="additional-picker">
            <button className="add-button w-full align-center button-height-l" type="button">
              <MdAdd /> Create a theme
            </button>
          </Popover.Toggle>
        </div>
        <Popover.Body id="additional-picker" zIndex={100}>
          <ColorPickerDesignSystem
            onConfirm={createTheme}
            defaultColor={themes.mainTheme?.background}
            tokens={tokenFamilies}
          />
        </Popover.Body>
      </Popover>
    </div>
  );
}

export default ThemeLeftbar;
