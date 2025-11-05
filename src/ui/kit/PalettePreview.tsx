import { PaletteBuild } from '../../domain/PaletteBuilderDomain';

function PalettePreview({
  paletteBuild,
  growIndex,
}: {
  paletteBuild: PaletteBuild;
  growIndex?: number;
}) {
  function getTintRounded(index: number): string {
    if (growIndex && index === growIndex) {
      return 'var(--uit-rounded-md)';
    } else if (index === 0) {
      return 'var(--uit-rounded-md) 0px 0px var(--uit-rounded-md)';
    } else if (index === paletteBuild.tints.length - 1) {
      return '0px var(--uit-rounded-md) var(--uit-rounded-md) 0px';
    }
    return '';
  }

  return (
    <div className="row align-center">
      {paletteBuild.tints.map((tint, index) => (
        <div
          key={tint.name}
          style={{
            height: index === growIndex ? '60px' : '40px',
            flex: index === growIndex ? 3 : 2,
            borderRadius: getTintRounded(index),
            transition: 'width 200ms',
            background: tint.color.toString({ format: 'hex' }),
          }}
        ></div>
      ))}
    </div>
  );
}

export default PalettePreview;
