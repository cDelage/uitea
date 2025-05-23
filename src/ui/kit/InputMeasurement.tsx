import {
  Measurement,
  UnitOfMeasurement,
} from "../../domain/DesignSystemDomain";

function InputMeasurement({
  measurement,
  setMeasurement,
  width,
  onBlur,
  flex,
  disableUnit
}: {
  measurement: Measurement;
  setMeasurement?: (measurement: Measurement) => void;
  width?: string;
  onBlur?: () => void;
  flex?: boolean;
  disableUnit?: boolean
}) {
  return (
    <div
      className="row uidt-input"
      style={{
        flex: flex ? "1" : undefined,
      }}
    >
      <input
        type="number"
        onBlur={onBlur}
        className="inherit-input empty-border skip-arrow left-spinner"
        size={(measurement.value ? measurement.value.toString().length : 1) + 1}
        value={measurement.value}
        style={{
          width,
          padding: "0px",
          paddingRight: "2px",
          borderBottom: "1px solid transparent",
        }}
        onChange={(e) =>
          setMeasurement?.({
            ...measurement,
            value: Number(e.target.value),
          })
        }
      />
      <select
        value={measurement.unit}
        className="inherit-select select-no-arrow uidt-input-select"
        onBlur={onBlur}
        disabled={disableUnit}
        style={{
          padding: "2px",
          borderRadius: "0px",
          borderLeft: "1px solid var(--uidt-base-border)",
          fontWeight: "var(--uidt-font-weight-bold)",
        }}
        onChange={(e) => {
          setMeasurement?.({
            ...measurement,
            unit: e.target.value as UnitOfMeasurement,
          });
        }}
      >
        <option
          value="PX"
          style={{
            fontWeight: "var(--uidt-font-weight-bold)",
          }}
        >
          px
        </option>
        <option
          value="REM"
          style={{
            fontWeight: "var(--uidt-font-weight-bold)",
          }}
        >
          rem
        </option>
      </select>
    </div>
  );
}

export default InputMeasurement;
